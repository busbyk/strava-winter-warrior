import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import formatDistance from 'date-fns/formatDistance'

const CHALLENGE_START_DATE = process.env.REACT_APP_CHALLENGE_START_DATE
const CHALLENGE_END_DATE = process.env.REACT_APP_CHALLENGE_END_DATE

export default function ProgressBar(props) {
  const max = 31
  const today = new Date()
  const current = today.getDate()

  const isWithinChallengeDates =
    isAfter(today, new Date(CHALLENGE_START_DATE)) &&
    isBefore(today, new Date(CHALLENGE_END_DATE))

  let displayVal
  if (isWithinChallengeDates) {
    displayVal = `${formatDistance(today, new Date(CHALLENGE_END_DATE))} left!`
  } else {
    displayVal = 'Challenge has ended!'
  }

  return (
    <div className='mb-6'>
      <h1 className='title has-text-white'>{displayVal}</h1>
      <progress
        className='progress is-large is-primary'
        value={current}
        max={max}
      >
        {displayVal}
      </progress>
    </div>
  )
}
