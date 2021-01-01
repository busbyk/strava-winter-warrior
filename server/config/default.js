const STRAVA_TOKENS = {
  STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
}

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const MONGODB = {
  MONGODB_URI: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@stravawinterwarriorclus.hzrug.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
}

const SESSION = {
  COOKIE_KEY: 'spamoni',
}

const KEYS = {
  ...STRAVA_TOKENS,
  ...MONGODB,
  ...SESSION,
}

module.exports = KEYS
