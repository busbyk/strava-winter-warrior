const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activitySchema = new Schema({
  name: String,
  startDate: String,
  athleteId: Number,
  distance: Number,
  type: String,
  activityId: {
    type: Number,
    unique: true,
  },
})

const Activity = mongoose.model('activity', activitySchema)

module.exports = Activity
