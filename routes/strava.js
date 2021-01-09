const stravaApi = require('strava-v3')
const router = require('express').Router()
const getWarriors = require('../models/scoreboard')
const User = require('../models/user-model')
const Activity = require('../models/activity-model')

router.get('/clubs', async (req, res, next) => {
  const strava = new stravaApi.client(req.user.accessToken)
  try {
    const payload = await strava.athlete.listClubs({})
    res.json(payload)
  } catch (err) {
    console.error(err)
  }
})

router.get('/warriors', async (req, res, next) => {
  const strava = new stravaApi.client(req.user.accessToken)
  try {
    const scores = await getWarriors(req.user.accessToken)
    res.status(200).json(scores)
  } catch (err) {
    console.error('Error in getWarriors(): ', err)

    if ((err = 'Error: Yer not in the club dude')) {
      res.status(500).json({ error: true, msg: 'User is not in the club' })
    } else {
      res.status(500).json({ msg: 'Internal server error' })
    }
  }
})

router.get('/getActivitiesForAllUsers', async (req, res, next) => {
  const allUsers = await User.find({})

  try {
    await Promise.all(
      allUsers.map(async (user) => {
        const strava = new stravaApi.client(user.accessToken)
        const startDateEpoch = Math.floor(+new Date('January 01, 2021') / 1000)
        const endDateEpoch = Math.floor(+new Date('February 01, 2021') / 1000)
        const activities = await strava.athlete.listActivities({
          before: endDateEpoch,
          after: startDateEpoch,
        })
        await Promise.all(
          activities.map(async (activity) => {
            try {
              const newActivity = await new Activity({
                name: activity.name,
                startDate: activity.start_date,
                athleteId: activity.athlete.id,
                distance: activity.distance,
                type: activity.type,
                activityId: activity.id,
              }).save()
            } catch (err) {
              if (err.message.indexOf('duplicate key error') === -1) {
                throw err
              }
              console.log(
                `Activity with id ${activity.id} already exists in the db`
              )
            }
          })
        )
      })
    )
    res.status(200).json({
      message: 'all activities loaded successfully',
    })
  } catch (err) {
    console.error(err)
    res.status(500)
  }
})

module.exports = router
