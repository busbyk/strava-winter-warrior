import formatDistance from 'date-fns/formatDistance'

const CHALLENGE_START_DATE = process.env.REACT_APP_CHALLENGE_START_DATE

export default function ChallengeCountdown() {
  return (
    <div>
      <h1 className='title has-text-white'>
        {' '}
        Callenge starts in{' '}
        {formatDistance(Date.now(), new Date(CHALLENGE_START_DATE))}!
      </h1>
      <p className='has-text-white'>
        Check back here to view the scoreboard and see where you stand.{' '}
      </p>
    </div>
  )
}
