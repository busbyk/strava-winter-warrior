import { Redirect } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

export default function LandingPage(props) {
  const auth = useAuth()
  if (auth.user) {
    return (
      <Redirect
        to={{
          pathname: '/scoreboard',
          state: { from: '/' },
        }}
      />
    )
  } else {
    return (
      <section className='hero is-link is-fullheight-with-navbar'>
        <div className='hero-body'>
          <div className='container has-text-centered'>
            <p className='title'>
              Welcome to the 2020 Winter Warrior Scoreboard
            </p>
            <button className='button is-primary' onClick={handleLoginClick}>
              <strong>Log in with Strava</strong>
            </button>
          </div>
        </div>
      </section>
    )
  }
}

function handleLoginClick() {
  window.open('http://localhost:3001/auth/strava', '_self')
}
