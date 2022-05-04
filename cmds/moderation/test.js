const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
const messageSchema = require('@schemas/statbotMessage-schema')
const voiceSchema = require('@schemas/statbotVoice-schema')
const morningSchema = require('@schemas/morning-schema')

module.exports = class eventTimeCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'test',
      group: 'moderation',
      memberName: 'test',
      description: 'for testing only',
      clientPermissions: ['ADMINISTRATOR'],
      userPermissions: ['MANAGE_MESSAGES'],
    })
  }

  async run(message) {
    const { member } = message
    const { id } = member
    
    const count = await morningSchema.findOne({ userId: id })
    if (count) {
      const then = new Date(count.updatedAt).getTime()
      const now = new Date().getTime()
      console.log("Then: ", new Date(then).getDate())
      console.log("Now: ", new Date(now).getDate())
    }
  }
}