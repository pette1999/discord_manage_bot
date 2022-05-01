const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
const messageSchema = require('@schemas/statbotMessage-schema')
const voiceSchema = require('@schemas/statbotVoice-schema')

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
    await mongo().then(async (mongoose) => {
      const obj = {
        userId: '594946541387513858',
        userName: 'Pettte#6695',
        voiceCount: '100',
        voiceRank: '5',
      }

      await voiceSchema.findOneAndUpdate(obj, obj, {
        upsert: true,
      })
    })
  }
}