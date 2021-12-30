import ScoreAttribute from './ScoreAttribute'
import {Link} from 'react-router-dom'
import {useAuth} from '../hooks/use-auth'

export default function WarriorCard(props) {
  const auth = useAuth()
  const {
    displayName,
    firstname,
    lastname,
    stravaId,
    profileImageUrl,
    numDaysActive,
    score,
    daysMissed,
    numActivities,
  } = props.user
  return (
    <div className='box warrior-card'>
      <article className='media'>
        <div className='media-content'>
          <div className='content'>
            <div className='level'>
              {!numActivities && !score && (
                <div className='notification'>
                  <p>
                    {firstname} hasn't signed in yet. Remind them to sign into
                    this app so their score can be calculated!
                  </p>
                </div>
              )}
              {score !== null && numActivities !== undefined && (
                <div className='level-item'>
                  <ScoreAttribute heading='Score' value={score} />
                </div>
              )}
              {numActivities !== null && numActivities !== undefined && (
                <div className='level-item'>
                  <ScoreAttribute
                    heading='Num Activites'
                    value={numActivities}
                  />
                </div>
              )}
              {numDaysActive !== null && numDaysActive !== undefined && (
                <div className='level-item'>
                  <ScoreAttribute
                    heading='Num Days Active'
                    value={numDaysActive}
                  />
                </div>
              )}
              {daysMissed !== null && daysMissed !== undefined && (
                <div className='level-item'>
                  <ScoreAttribute heading='Days Missed' value={daysMissed} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='media-right'>
          <div className='is-flex is-flex-direction-column is-align-items-center'>
            <h1 className='mb-1 title is-5'>
              <a
                href={`https://www.strava.com/athletes/${stravaId}`}
                target='_blank'
                rel='noreferrer'
              >
                <strong>{displayName || `${firstname} ${lastname}`}</strong>
              </a>
            </h1>
            <figure className='image is-64x64'>
              <img
                className='is-rounded'
                src={
                  profileImageUrl ||
                  'https://bulma.io/images/placeholders/128x128.png'
                }
                alt='Profile'
              />
            </figure>
            {auth.user.displayName === displayName && (
              <button className='button is-small mt-2'>
                <Link to={`/activities/${stravaId}`}>View Activities</Link>
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
