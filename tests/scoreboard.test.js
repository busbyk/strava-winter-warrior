const { test, expect } = require('@jest/globals')
const { sortActivitiesByDate } = require('../models/scoreboard')

let datesInMonth = []
for (let i = 1; i <= 31; i++) {
  datesInMonth.push(i)
}

test('calcNumDaysActive counts total days active', () => {
  const activities = [
    { start_date: '2021-01-01T18:02:13Z' },
    { start_date: '2021-01-01T18:02:13Z' },
    { start_date: '2021-01-02T18:02:13Z' },
    { start_date: '2021-01-03T18:02:13Z' },
    { start_date: '2021-01-03T18:02:13Z' },
    { start_date: '2021-01-03T18:02:13Z' },
    { start_date: '2021-01-05T18:02:13Z' },
  ]

  const activitiesByDate = sortActivitiesByDate(activities, datesInMonth)
  console.log(activitiesByDate)

  expect(activitiesByDate).toBe([
    [
      { start_date: '2021-01-01T18:02:13Z' },
      { start_date: '2021-01-01T18:02:13Z' },
    ],
    [{ start_date: '2021-01-02T18:02:13Z' }],
    [
      { start_date: '2021-01-03T18:02:13Z' },
      { start_date: '2021-01-03T18:02:13Z' },
      { start_date: '2021-01-03T18:02:13Z' },
    ],
    [],
    [{ start_date: '2021-01-05T18:02:13Z' }],
  ])
})
