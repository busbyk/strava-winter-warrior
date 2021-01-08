const cookieSession = require('cookie-session')
const express = require('express')
const app = express()
require('dotenv').config()
const passport = require('passport')
require('./strava-passport')
const authRoutes = require('./routes/auth')
const stravaRoutes = require('./routes/strava')
const { COOKIE_KEY, MONGODB_URI, PORT } = require('./config/default')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const User = require('./models/user-model')
const refresh = require('passport-oauth2-refresh')
const path = require('path')

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('connected to mongo db')
  }
)

app.use(
  cookieSession({
    name: 'session',
    keys: [COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
    resave: false,
  })
)

app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   })
// )

app.use('/auth', authRoutes)

const ensureAuthenticated = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: 'user has not been authenticated',
    })
  } else {
    // check if token needs to be refreshed
    const user = await User.findOne({
      stravaId: req.user.stravaId,
    })
    let { tokenExpiresAt } = user
    const now = new Date()
    const secondsFromEpochToNow = Math.floor(now / 1000)

    if (tokenExpiresAt < secondsFromEpochToNow) {
      refresh.requestNewAccessToken(
        'strava',
        user.refreshToken,
        function (err, accessToken, refreshToken, params) {
          if (err) {
            return res.status(401).json({
              authenticated: false,
              message: "failed to refresh user's access token",
            })
          }
          user.accessToken = accessToken
          user.refreshToken = refreshToken
          user.tokenExpiresAt = params.expires_at
          user.save()
          req.logIn(user, (err) => {
            console.error(err)
          })
        }
      )
    }
    next()
  }
}

app.use('/strava', ensureAuthenticated, stravaRoutes)

// app.get('/', ensureAuthenticated, (req, res) => {
//   res.status(200).json({
//     authenticated: true,
//     message: 'user successfully authenticated',
//     user: req.user,
//     cookies: req.cookies,
//   })
// })

app.get('/user', ensureAuthenticated, (req, res) => {
  res.status(200).json(req.user)
})

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))
