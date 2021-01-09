export default function ScoreAttribute(props) {
  const { heading, value } = props
  return (
    <div className='is-flex is-flex-direction-column is-align-items-center'>
      <h1 className='title is-5'>{heading}</h1>
      <span className='score-attribute-value'>{value}</span>
    </div>
  )
}
