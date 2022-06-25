const morningSchema = require('@schemas/morning-schema')
const nightSchema = require('@schemas/night-schema')
const updateLogs = require('../../util/update-logs')

const manageGreet = async (client) => {
  let morningCache = []
  let nightCache = []
  const clearCache = () => {
    morningCache = []
    nightCache = []
    setTimeout(clearCache, 1000 * 60 * 0) // 10 minutes
  }
  clearCache()
  const alreadyMorning = 'You have already checked in with morning today'
  const alreadyNight = 'You have already checked out with night today'
  client.on("message", async msg => {
    const { channel, content, author } = msg
    const username = `${author.username}#${author.discriminator}`
    var morningCount = 1
    if (content.toLowerCase() == 'morning') {
      if (morningCache.includes(author.id)) {
        console.log('Returning from cache')
        message.reply(alreadyMorning)
        return
      }
      const count = await morningSchema.findOne({ userId: author.id })
      if (count) {
        morningCount = count.morningCount + 1

        const then = new Date(count.updatedAt).getTime()
        const now = new Date().getTime()

        const updatedDay = new Date(then).getDate()
        const nowDay = new Date(now).getDate()
        const diffDay = Math.abs(nowDay - updatedDay)

        // if next day, then is about to checkin morning again
        if (diffDay <= 0) {
          morningCache.push(author.id)

          msg.reply(alreadyMorning)
          return
        }
      } else {
        morningCount = 1
      }
      const obj = {
        userId: author.id,
        userName: username,
        morningCount: morningCount,
      }
      await morningSchema.findOneAndUpdate({ userId: author.id }, obj, {
        upsert: true,
      })
      morningCache.push(author.id)
      msg.reply("Good Morning! :sunny: \nCheck out <https://bit.ly/3lzOfRd> for more information about Beta BRP reward system!")
      // log the checkin directly
      updateLogs(author.id, "morning")
    } else if (content.toLowerCase() == 'night') {
      if (nightCache.includes(author.id)) {
        console.log('Returning from cache')
        message.reply(alreadyNight)
        return
      }
      const count = await nightSchema.findOne({ userId: author.id })
      const morning = await morningSchema.findOne({ userId: author.id })
      if (morning) {
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
          msg.reply("Sorry, please wait a few more hours to check out with night :timer:")
          return
        } else if (lastUpdateDate != nowDay && diffHour > 6) {
          msg.reply("Remember to morning check in tomorrow! :grinning:")
        }
      } else {
        msg.reply("Remember to morning check in tomorrow! :grinning:")
      }
      if (count) {
        nightCount = count.nightCount + 1

        const then = new Date(count.updatedAt).getTime()
        const now = new Date().getTime()

        const updatedDay = new Date(then).getDate()
        const nowDay = new Date(now).getDate()
        const diffDay = Math.abs(nowDay - updatedDay)

        if (diffDay <= 0) {
          nightCache.push(author.id)

          msg.reply(alreadyNight)
          return
        }
      } else {
        nightCount = 1
      }
      const obj = {
        userId: author.id,
        userName: username,
        nightCount: nightCount,
      }
      await nightSchema.findOneAndUpdate({ userId: author.id }, obj, {
        upsert: true,
      })
      nightCache.push(author.id)
      msg.reply("Good Evening! :crescent_moon: \nCheck out <https://bit.ly/3lzOfRd> for more information about Beta BRP reward system!")
      // log the checkin directly
      updateLogs(author.id, "night")
    }
  })
}

module.exports = async (client) => {
  manageGreet(client)
}