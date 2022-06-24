const Commando = require('discord.js-commando')

module.exports = class postCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      group: 'misc',
      memberName: 'invite',
      description: 'Record your speaker invites for BRP rewards',
      argsType: 'multiple',
    })
  }

  async run(message, args) {
    const { guild, member } = message
    const { id, user } = member

    console.log(args[0], args[1])
    if (args[0].toLowerCase() == 'mentor') {
      console.log(`Mentor name: ${args[1]}`)
    }
  }
}