import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ActivitiesTable from './ActivitiesTable'

export default function ActivitiesList(props) {
  const { athleteId } = useParams()

  const [activities, setActivities] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const activitiesList = await getActivitiesList(athleteId)
        setActivities(activitiesList)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }
    fetchData()
  }, [athleteId])

  return (
    <section className='section'>
      <div className='container is-max-desktop'>
        {loading && (
          <progress
            className='progress is-large is-primary'
            max='100'
          ></progress>
        )}
        {error && (
          <div className='notification is-warning'>
            <p>
              Something went wrong fetching your activities. Please contact{' '}
              <a href='mailto:kellenbusby@gmail.com'>the admin.</a>.
            </p>
          </div>
        )}
        {activities && <ActivitiesTable data={activities} />}
      </div>
    </section>
  )
}

async function getActivitiesList(athleteId) {
  const res = await fetch(`/api/strava/listUserActivities/${athleteId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true,
    },
  })
  if (res.status === 200) return res.json()
  throw new Error('failed to get user activities')
}
