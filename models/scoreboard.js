const stravaApi = require('strava-v3')
const User = require('../models/user-model')
const Activity = require('../models/activity-model')
const { match } = require('assert')

let datesInMonth = []
for (let i = 1; i <= 31; i++) {
  datesInMonth.push(i)
}

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
  const numActivities = activities.length
  const activitiesByDate = sortActivitiesByDate(activities, datesInMonth)

  let numDaysActive = 0
  let daysMissed = 0

  activitiesByDate.forEach((activities) => {
    console.log('activities.length: ', activities.length)
    if (activities.length > 0) {
      numDaysActive++
    } else {
      daysMissed++
    }
  })

  let score = 0
  score += numDaysActive * 10
  score -= daysMissed * 10
  score = activities
    .filter((activity) => isValidActivityType(activity.type))
    .map((activity) => activity.distance / 1609.34) // meters to miles
    .reduce((accum, cur) => (accum += cur), score)
  score = score.toFixed(1)

  return [numDaysActive, score, daysMissed, numActivities]
}

const sortActivitiesByDate = function (activities, dates) {
  const dateToday = new Date().getDate()

  let jan = new Date('January, 2021')
  let activitiesByDate = []

  dates.forEach((date) => {
    const searchDate = new Date(jan.setDate(date))
    const matchingActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.startDate)

      return (
        searchDate.getFullYear() === activityDate.getFullYear() &&
        searchDate.getMonth() === activityDate.getMonth() &&
        searchDate.getDate() === activityDate.getDate() &&
        isValidActivityType(activity.type)
      )
    })

    activitiesByDate.push(matchingActivities)
  })

  return activitiesByDate.slice(0, dateToday)
}

const isValidActivityType = function (type) {
  const validTypes = ['BackcountrySki', 'Hike', 'Run', 'Snowshoe', 'Walk']
  return validTypes.includes(type)
}

module.exports = { getWarriors, sortActivitiesByDate, isValidActivityType }
