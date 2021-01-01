const passport = require('passport')
const StravaStrategy = require('passport-strava-oauth2').Strategy
const User = require('./models/user-model')
const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = require('./config/default')
const refresh = require('passport-oauth2-refresh')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user)
    })
    .catch((e) => {
      done(new Error('Failed to deserialize an user'))
    })
})

const strategy = new StravaStrategy(
  {
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: '/auth/strava/callback',
  },
  async (accessToken, refreshToken, params, profile, done) => {
    const existingUser = await User.findOne({
      stravaId: profile.id,
    })

    if (!existingUser) {
      const newUser = await new User({
        displayName: profile.displayName,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        stravaId: profile.id,
        profileImageUrl: profile.photos[0].value,
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpiresAt: params.expires_at,
      }).save()

      if (newUser) {
        return done(null, newUser)
      }
    }
    done(null, existingUser)
  }
)

passport.use(strategy)
refresh.use(strategy)
