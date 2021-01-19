const stravaApi = require('strava-v3')
const router = require('express').Router()
const { getWarriors, isValidActivityType } = require('../models/scoreboard')
const User = require('../models/user-model')
const Activity = require('../models/activity-model')
const refresh = require('passport-oauth2-refresh')

router.get('/clubs', async (req, res, next) => {
  const strava = new stravaApi.client(req.user.accessToken)
  try {
    const payload = await strava.athlete.listClubs({})
    res.json(payload)
  } catch (err) {
    console.error(err)
  }
})

router.get('/warriors', async (req, res) => {
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

router.get('/listUserActivities/:athleteId', async (req, res) => {
  const athleteId = req.params.athleteId
  const activities = await Activity.find().where('athleteId').equals(athleteId)
  const shortActivities = activities.map((activity) => {
    const shortAct = {
      name: activity.name,
      date: new Date(activity.startDate).toDateString(),
      activityId: activity.activityId,
      distance: activity.distance,
      miles: (activity.distance / 1609.34).toFixed(1),
      type: activity.type,
      valid: isValidActivityType(activity.type),
    }
    return shortAct
  })
  res.status(200).json(shortActivities)
})

router.get('/getActivitiesForAllUsers', async (req, res) => {
  const allUsers = await User.find({})

  try {
    await Promise.all(
      allUsers.map(async (user) => {
        const strava = new stravaApi.client(user.accessToken)
        const startDateEpoch = Math.floor(+new Date('January 01, 2021') / 1000)
        const endDateEpoch = Math.floor(+new Date('February 01, 2021') / 1000)

        let activities
        try {
          activities = await strava.athlete.listActivities({
            before: endDateEpoch,
            after: startDateEpoch,
          })
        } catch (err) {
          const body = err.response.body
          if (
            body.errors &&
            body.errors[0].code === 'invalid' &&
            body.errors[0].field === 'access_token'
          ) {
            await refresh.requestNewAccessToken(
              'strava',
              user.refreshToken,
              async (err, accessToken, refreshToken) => {
                if (err) {
                  throw new Error(
                    'error refreshing token for ',
                    user.displayName
                  )
                }
                user.accessToken = accessToken
                user.refreshToken = refreshToken
                await user.save()
              }
            )
            const refreshedStrava = new stravaApi.client(user.accessToken)
            activities = await refreshedStrava.athlete.listActivities({
              before: endDateEpoch,
              after: startDateEpoch,
            })
          } else {
            throw new Error(err)
          }
        }

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
