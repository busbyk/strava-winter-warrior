import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Scoreboard from './components/Scoreboard'
import LandingPage from './components/LandingPage'
import ActivitiesList from './components/ActivitiesList'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import {ProvideAuth, useAuth} from './hooks/use-auth'

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path='/'>
            <LandingPage />
          </Route>
          <PrivateRoute path='/scoreboard'>
            <Scoreboard />
          </PrivateRoute>
          <PrivateRoute path='/activities/:athleteId'>
            <ActivitiesList />
          </PrivateRoute>
        </Switch>
        <Footer />
      </Router>
    </ProvideAuth>
  )
}

function PrivateRoute({children, ...rest}) {
  const auth = useAuth()
  return (
    <Route
      {...rest}
      render={({location}) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: {from: location},
            }}
          />
        )
      }
    />
  )
}
