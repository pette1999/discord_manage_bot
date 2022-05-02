const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
const morningSchema = require('@schemas/morning-schema')

let morningCache = []

const clearCache = () => {
  morningCache = []
  setTimeout(clearCache, 1000 * 60 * 0) // 10 minutes
}
clearCache()

const alreadyMorning = 'You have already checked in with morning today'

module.exports = class eventTimeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'morning',
      group: 'misc',
      memberName: 'morning',
      description: 'Greeting people with morning',
    })
  }

  async run(message) {
    const { member } = message
    const { id } = member
    const user = member.user
    var morningCount = 1

    if (morningCache.includes(id)) {
      console.log('Returning from cache')
      message.reply(alreadyMorning)
      return
    }

    await mongo().then(async (mongoose) => {
      try {
        const count = await morningSchema.findOne({ userId: id })
        if(count) {
          morningCount = count.morningCount + 1

          const then = new Date(count.updatedAt).getTime()
          const now = new Date().getTime()
          
          const updatedDay = new Date(then).getDate()
          const nowDay = new Date(now).getDate()
          const diffDay = Math.abs(nowDay - updatedDay)

          // if next day, then is about to checkin morning again
          if (diffDay <= 0) {
            morningCache.push(id)

            message.reply(alreadyMorning)
            return
          }
        } else [
          morningCount = 1
        ]

        const obj = {
          userId: id,
          userName: user.tag,
          morningCount: morningCount,
        }

        await morningSchema.findOneAndUpdate({ userId: id }, obj, {
          upsert: true,
        })

        morningCache.push(id)
        message.reply("Good Morning! :sunny:")
      } finally {
        mongoose.connection.close()
      }
    })
  }
}