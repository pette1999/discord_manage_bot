const Commando = require('discord.js-commando')
const attendanceSchema = require('@schemas/attendance-schema')
const eventTimeframeSchema = require('@schemas/event-timeframe-schema')
const updateLogs = require('../../util/update-logs')

// Array of member IDs who have checked in in the last 24 hours
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
      argsType: 'single',
      argsCount: 1,
    })
  }

  async run(message, args) {
    const { guild, member, channel } = message
    const { id } = member
    const user = member.user
    let today = new Date().toISOString().slice(0, 10)
    const eventCode = args.trim()
    console.log("ARGS: ", args)

    // if input without code, unable to check in
    if (args === '') {
      message.reply("Wrong command, please add a code to the command to Check-In :wink:")
      return
    }

    if (checkinCache.includes(id)) {
      console.log('Returning from cache')
      message.reply(alreadyCheckedin)
      return
    }

    console.log('Fetching from mongo')

    try {
      const messages = await channel.messages.fetch(0)

      let i = 0
      const filtered = []
      messages.filter((m) => {
        if (m.author.id === id && 1 > i) {
          filtered.push(m)
          i++
        }
      })
      await channel.bulkDelete(filtered, true).then(messages => {
        console.log("message deleted")
      })
    } catch (err) {
      console.error(err)
      channel.send(
        '```css\n[ERROR] ' + err.code + ': [' + err.message + ']\n```'
      )
    }

    const results = await attendanceSchema.findOne({ userId: id })
    console.log('RESULTS:', results)

    const attendanceArr = await attendanceSchema.findOne({ userId: id }, { "attendance": 1, "_id": 0 }).distinct('attendance')
    console.log(attendanceArr)

    const eventCodes = await eventTimeframeSchema.find().distinct('code')
    const eventStartTime = await eventTimeframeSchema.findOne({ 'code': eventCode }, { "start": 1, "_id": 0 }).distinct('start')
    const eventEndTime = await eventTimeframeSchema.findOne({ 'code': eventCode }, { "end": 1, "_id": 0 }).distinct('end')
    console.log("Start: ", eventStartTime[0])
    console.log("End: ", eventEndTime[0])
    console.log("Event Codes: ", eventCodes)

    if (eventCodes.indexOf(eventCode) == -1) {
      // the event code does not exist in the current database
      message.reply("Sorry, your event code does not seems correct :confused:")
      return
    }

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
      console.log("now: ", now)
      console.log("then: ", then)

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
    message.reply("You have checked in for today's event!:grinning:")
    // log the checkin directly
    updateLogs(id, `checkin ${args}`)
  }
}