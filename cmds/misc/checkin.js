const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
const attendanceSchema = require('@schemas/attendance-schema')
const eventTimeframeSchema = require('@schemas/event-timeframe-schema')

// Array of member IDs who have checked in in the last 24 hours
// Resets every 10 minutes
let checkinCache = []

const clearCache = () => {
  checkinCache = []
  setTimeout(clearCache, 1000 * 60 * 0) // 10 minutes
}
clearCache()

const alreadyCheckedin = 'You have already checked in for this event'

module.exports = class CheckinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'checkin',
      group: 'misc',
      memberName: 'checkin',
      description: 'Check in for events',
    })
  }

  async run(message) {
    const { guild, member } = message
    const { id } = member
    const user = message.mentions.users.first() || message.member.user
    let today = new Date().toISOString().slice(0, 10)

    if (checkinCache.includes(id)) {
      console.log('Returning from cache')
      message.reply(alreadyCheckedin)
      return
    }

    console.log('Fetching from mongo')

    await mongo().then(async (mongoose) => {
      try {
        const results = await attendanceSchema.findOne({ userId: id })
        console.log('RESULTS:', results)

        const attendanceArr = await attendanceSchema.findOne({ userId: id }, { "attendance": 1, "_id": 0 }).distinct('attendance')
        console.log(attendanceArr)

        const eventStartTime = await eventTimeframeSchema.findOne({ '_id': '626789e3a8bd69d76483798a' }, { "start": 1, "_id": 0 }).distinct('start')
        const eventEndTime = await eventTimeframeSchema.findOne({ '_id': '626789e3a8bd69d76483798a' }, { "end": 1, "_id": 0 }).distinct('end')
        console.log("Start: ", eventStartTime[0])
        console.log("End: ", eventEndTime[0])

        if (!(today in attendanceArr)) {
          attendanceArr.push(today)
        }

        const obj = {
          userId: id,
          userName: user.tag,
          attendance: attendanceArr,
        }

        if (results) {
          const then = new Date(results.updatedAt).getTime()
          const now = new Date().getTime()
          console.log("now: ",now)
          console.log("then: ",then)

          if ((BigInt(now) >= BigInt(eventStartTime) && now <= BigInt(eventEndTime))) {
          } else if (BigInt(now) > BigInt(eventEndTime)) {
            message.reply("Sorry! You missed the event :sob:")
            return
          } else if (BigInt(now) < BigInt(eventStartTime)) {
            message.reply("Yoo! The event hasn't started yet :blush:")
            return
          }

          const diffTime = Math.abs(now - then)
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays <= 1) {
            checkinCache.push(id)

            message.reply(alreadyCheckedin)
            return
          }
        }

        await attendanceSchema.findOneAndUpdate({ userId: id }, obj, {
          upsert: true,
        })

        checkinCache.push(id)
        message.reply("You have checked in for today's event!")
      } finally {
        mongoose.connection.close()
      }
    })
  }
}