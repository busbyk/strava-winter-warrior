const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  displayName: String,
  firstname: String,
  lastname: String,
  screenName: String,
  stravaId: String,
  profileImageUrl: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Number,
})

const User = mongoose.model('user', userSchema)

module.exports = User
