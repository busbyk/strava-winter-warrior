import ScoreAttribute from './ScoreAttribute'

export default function WarriorCard(props) {
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
              {score && (
                <div className='level-item'>
                  <ScoreAttribute heading='Score' value={score} />
                </div>
              )}
              {numActivities && (
                <div className='level-item'>
                  <ScoreAttribute
                    heading='Num Activites'
                    value={numActivities}
                  />
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
          </div>
        </div>
      </article>
    </div>
  )
}
