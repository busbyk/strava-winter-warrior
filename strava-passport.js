const passport = require('passport')
const StravaStrategy = require('passport-strava-oauth2').Strategy
const User = require('./models/user-model')
const {STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET} = require('./config/default')
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
    callbackURL: '/api/auth/strava/callback',
  },
  async (accessToken, refreshToken, params, profile, done) => {
    try {
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

      if (existingUser.profileImageUrl !== params.athlete.profile) {
        try {
          existingUser.profileImageUrl = params.athlete.profile
          await existingUser.save()
        } catch (err) {
          console.error(
            `Couldn't update profile photo for ${existingUser.displayName}`
          )
        }
      }

      done(null, existingUser)
    } catch (err) {
      console.error(err)
      done(null, null)
    }
  }
)

passport.use(strategy)
refresh.use(strategy)
