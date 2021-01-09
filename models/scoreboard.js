const stravaApi = require('strava-v3')
const User = require('../models/user-model')
const Activity = require('../models/activity-model')

const getWarriors = async function (accessToken) {
  const strava = new stravaApi.client(accessToken)
  const clubs = await strava.athlete.listClubs({})
  const club = clubs.find((club) => club.name === 'Winter Warrior 2021')

  if (club) {
    const { id } = club
    const members = await strava.clubs.listMembers({ id: id })
    let warriors = members.map(({ firstname, lastname }) => ({
      firstname,
      lastname,
    }))

    const allUsers = await User.find({})
    warriors = await Promise.all(
      warriors.map(async (warrior) => {
        const registeredUser = allUsers.find((user) => {
          return (
            warrior.firstname === user.firstname &&
            warrior.lastname === user.lastname.substring(0, 1) + '.'
          )
        })
        if (registeredUser) {
          const activities = await getActivitiesForUser(registeredUser.stravaId)
          const [numDaysActive, score, daysMissed, numActivities] = makeScore(
            activities
          )
          return Object.assign(warrior, {
            hasRegistered: true,
            displayName: registeredUser.displayName,
            lastname: registeredUser.lastname,
            stravaId: registeredUser.stravaId,
            profileImageUrl: registeredUser.profileImageUrl,
            numActivities: numActivities,
            numDaysActive: numDaysActive,
            score: score,
            daysMissed: daysMissed,
          })
        } else {
          return Object.assign(warrior, {
            hasRegistered: false,
            score: null,
          })
        }
      })
    )

    warriors.sort((a, b) => {
      if (a.score > b.score) {
        return -1
      }
      if (a.score < b.score) {
        return 1
      }
      return 0
    })

    return warriors
  } else {
    throw new Error('Yer not in the club dude')
  }
}

const getActivitiesForUser = async function (stravaId) {
  return await Activity.find().where('athleteId').equals(stravaId)
}

const makeScore = function (activities) {
  const numDaysActive = activities.length //TODO update this to count unique days cuz peeps could have multiple activities on the same day
  const numActivities = activities.length

  const daysMissed = 0

  let score = 0
  score += numDaysActive
  score = activities
    .map((activity) => activity.distance / 5280)
    .reduce((accum, cur) => (accum += cur), score)
  score = score.toFixed(1)

  return [numDaysActive, score, daysMissed, numActivities]
}

module.exports = getWarriors
