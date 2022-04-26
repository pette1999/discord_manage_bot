const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
const eventTimeframeSchema = require('@schemas/event-timeframe-schema')

module.exports = class eventTimeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'eventtime',
      group: 'moderation',
      memberName: 'eventtime',
      description: 'Set event time frame for the checkin command',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['MANAGE_MESSAGES'],
      argsType: 'multiple',
    })
  }
  
  async run(message, args) {
    await mongo().then(async (mongoose) => {
      try {
        if (args.length == 2) {
          const startTime = new Date(args[0]).getTime()
          const endTime = new Date(args[1]).getTime()
          if (endTime <= startTime) {
            message.reply("You have entered a wrong command!")
            return
          }
          const obj = {
            start: startTime,
            end: endTime,
          }
          const startDate = new Date(startTime).toLocaleString('en-US')
          const endDate = new Date(endTime).toLocaleString('en-US')
          await eventTimeframeSchema.findOneAndUpdate({ '_id':'626789e3a8bd69d76483798a'}, obj, {
            upsert: true,
          })
          const reply = "Event time updated!\nEvent starts at " + startDate + "\nEvent ends at " + endDate
          message.reply(reply)
        } else {
          message.reply("You have entered a wrong command! ")
        }
      } finally {
        mongoose.connection.close()
      }
    })
  }
}

