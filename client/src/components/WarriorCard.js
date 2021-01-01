export default function WarriorCard(props) {
  const {
    displayName,
    firstname,
    lastname,
    stravaId,
    profileImageUrl,
  } = props.user
  return (
    <div className='box'>
      <article className='media'>
        <div className='media-left'>
          <figure className='image is-64x64'>
            <img
              src={
                profileImageUrl ||
                'https://bulma.io/images/placeholders/128x128.png'
              }
              alt='Profile'
            />
          </figure>
        </div>
        <div className='media-content'>
          <div className='content'>
            <p>
              <a href={`https://www.strava.com/athelete/${stravaId}`}>
                <strong>{displayName || `${firstname} ${lastname}`}</strong>
              </a>
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
