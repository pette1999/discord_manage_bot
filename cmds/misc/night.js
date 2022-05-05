const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
const nightSchema = require('@schemas/night-schema')
const morningSchema = require('@schemas/morning-schema')

let nightCache = []

const clearCache = () => {
  nightCache = []
  setTimeout(clearCache, 1000 * 60 * 0) // 10 minutes
}
clearCache()

const alreadyNight = 'You have already checked out with night today'

module.exports = class eventTimeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'night',
      group: 'misc',
      memberName: 'night',
      description: 'Greeting people with night',
    })
  }

  async run(message) {
    const { member } = message
    const { id } = member
    const user = member.user
    var nightCount = 1

    if (nightCache.includes(id)) {
      console.log('Returning from cache')
      message.reply(alreadyNight)
      return
    }

    const count = await nightSchema.findOne({ userId: id })
    const morning = await morningSchema.findOne({ userId: id })
    if (morning) {
      console.log(morning)
      // has morning record, and checked-in in the morning
      const lastUpdate = new Date(morning.updatedAt).getTime()
      const lastUpdateDate = new Date(new Date(lastUpdate).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).getDate()
      const nowTime = new Date().getTime()
      const nowDay = new Date(new Date(nowTime).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })).getDate()
      // hours difference 
      const diff = Math.abs(nowTime - lastUpdate)
      const diffHour = Math.round(diff / (1000 * 60 * 60))
      console.log("lastUpdateDate: ", lastUpdateDate)
      console.log("nowDay: ", nowDay)
      console.log("diffHour: ", diffHour)

      if (lastUpdateDate == nowDay && diffHour >= 6) {
        // okay to check out with night
      } else if (lastUpdateDate == nowDay && diffHour < 6) {
        message.reply("Sorry, please wait a few more hours to check out with night :timer:")
        return
      } else if (lastUpdateDate != nowDay && diffHour > 6) {
        message.reply("Remember to morning check in tomorrow! :grinning:")
      }

      // has the morning, but does not have the check-in in the morning
    } else {
      message.reply("Remember to morning check in tomorrow! :grinning:")
    }

    if (count) {
      nightCount = count.nightCount + 1

      const then = new Date(count.updatedAt).getTime()
      const now = new Date().getTime()

      const updatedDay = new Date(then).getDate()
      const nowDay = new Date(now).getDate()
      const diffDay = Math.abs(nowDay - updatedDay)

      if (diffDay <= 0) {
        nightCache.push(id)

        message.reply(alreadyNight)
        return
      }
    } else {
      nightCount = 1
    }

    const obj = {
      userId: id,
      userName: user.tag,
      nightCount: nightCount,
    }

    await nightSchema.findOneAndUpdate({ userId: id }, obj, {
      upsert: true,
    })

    nightCache.push(id)
    message.reply("Good Evening! :crescent_moon:")
  }
}