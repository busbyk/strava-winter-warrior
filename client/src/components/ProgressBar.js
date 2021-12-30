export default function ProgressBar(props) {
  const max = 31
  const today = new Date()
  const current = today.getDate()
  let displayVal
  if (today.getMonth() === 0 && today.getFullYear() === 2021) {
    displayVal = `${current} days down, ${
      max - current
    } days to go! Finish strong!`
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
