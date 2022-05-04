const Commando = require('discord.js-commando')
const userinfoSchema = require('@schemas/userinfo-schema')

module.exports = class postCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setleaderboard',
      group: 'misc',
      memberName: 'setleaderboard',
      description: 'set leaderboard',
    })
  }

  async run(message) {
    const { guild, member } = message
    const { id } = member

    await userinfoSchema.findOneAndUpdate({
      user_Id: id,
    },{
      user_Id: id,
    },{
      upsert: true
    })

    message.reply("Leaderboard set")
  }
}