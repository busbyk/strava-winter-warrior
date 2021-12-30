import React, {useEffect, useState, useMemo} from 'react'
import WarriorCard from './WarriorCard'
import ProgressBar from './ProgressBar'
import ChallengeCountdown from './ChallengeCountdown'

const CHALLENGE_START_DATE = process.env.REACT_APP_CHALLENGE_START_DATE

export default function Scoreboard() {
  const [warriors, setWarriors] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState()

  const isBeforeChallengeStart = useMemo(() => {
    return Date.now() < new Date(CHALLENGE_START_DATE)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        await fetchNewActivities()
        const warriors = await getWarriors()
        setWarriors(warriors)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    if (Date.now() > new Date(CHALLENGE_START_DATE)) {
      fetchData()
    }
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
            {error.message === 'User is not in the club' && (
              <>
                <p>
                  Looks like you're not part of the{' '}
                  <strong>Winter Warrior 2022</strong> club on Strava.
                </p>
                <br />
                <p>
                  Please go{' '}
                  <strong>
                    <a
                      href='https://www.strava.com/clubs/WW2022'
                      target='_blank'
                      rel='noreferrer'
                    >
                      join that group on Strava
                    </a>
                  </strong>{' '}
                  and then reload this page.
                </p>
              </>
            )}
            {error.message !== 'User is not in the club' && (
              <>
                <p>Oh jeez, something went wrong.</p>
                <p className='mt-2'>Try reloading the page...</p>
                <p className='mt-5'>
                  If that didn't work, send me an email:{' '}
                  <a href='mailto:kellenbusby@gmail.com'>
                    kellenbusby@gmail.com
                  </a>
                </p>
              </>
            )}
          </div>
        )}
        {!loading && !isBeforeChallengeStart && <ProgressBar />}
        {warriors &&
          warriors.map((warrior, idx) => (
            <WarriorCard user={warrior} key={idx} />
          ))}
        {isBeforeChallengeStart && <ChallengeCountdown />}
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

  const errRes = await res.json()
  throw new Error(errRes.msg)
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
