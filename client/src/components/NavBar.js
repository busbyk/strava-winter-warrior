import { useAuth } from '../hooks/use-auth'

export default function NavBar(props) {
  const auth = useAuth()

  async function handleLogoutClick() {
    await auth.logout()
    window.open('http://localhost:3000/auth/logout', '_self') //TODO change this to be a fetch and on the server just log the user out, update Router to redirect unknown routes to /
  }

  return (
    <nav
      className='navbar is-light'
      role='navigation'
      aria-label='main navigation'
    >
      <div className='container'>
        <div className='navbar-brand'>
          <a className='navbar-item' href='/'>
            <h1 className='title'>Winter Warrior Scoreboard</h1>
          </a>
        </div>
        <div id='navbarBasicExample' className='navbar-menu'>
          <div className='navbar-end'>
            <div className='navbar-item'>
              {auth.user && (
                <div className='level'>
                  <div className='level-item'>
                    <span className='mr-4'>
                      Hey there, {auth.user.displayName}
                    </span>
                  </div>
                  <div className='level-item'>
                    <button
                      className='button is-small'
                      onClick={handleLogoutClick}
                    >
                      <strong>Log out</strong>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
