import React, { useEffect, useState } from 'react'
import WarriorCard from './WarriorCard'
import ProgressBar from './ProgressBar'

export default function Scoreboard() {
  const [warriors, setWarriors] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchNewActivities()
        const warriors = await getWarriors()
        setWarriors(warriors)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
              Looks like you're not part of the{' '}
              <strong>Winter Warrior 2021</strong> club on Strava.
            </p>
            <br />
            <p>
              Please go{' '}
              <strong>
                <a
                  href='https://www.strava.com/clubs/WW2021'
                  target='_blank'
                  rel='noreferrer'
                >
                  join that group on Strava
                </a>
              </strong>{' '}
              and then reload this page.
            </p>
          </div>
        )}
        {!loading && <ProgressBar />}
        {warriors && warriors.map((warrior) => <WarriorCard user={warrior} />)}
      </div>
    </section>
  )
}

async function getWarriors() {
  const res = await fetch('/api/strava/warriors', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true,
    },
  })
  if (res.status === 200) return res.json()
  throw new Error('failed to authenticate user')
}

async function fetchNewActivities() {
  const res = await fetch('/api/strava/getActivitiesForAllUsers', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true,
    },
  })
  if (res.status === 200) return res.json()
  throw new Error('failed to fetch new activities')
}
