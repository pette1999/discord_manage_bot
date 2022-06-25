const Commando = require('discord.js-commando')
const speakerInviteSchema = require('@schemas/speaker-invite-schema')
const { MessageEmbed } = require("discord.js")

module.exports = class inviteCommand extends Commando.Command {
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
    const { guild, member, channel } = message
    const { id, user } = member

    console.log(args[0], args[1])
    if (args[0].toLowerCase() == 'mentor') {
      // user invited a mentor
      console.log(`Mentor name: ${args[1]}`)
    } else if (args[0].toLowerCase() == 'host') {
      // user invited a host
      console.log(`Host name: ${args[1]}`)
    } else {
      // user using a wrong command
      message.reply("Please specify that you invited a mentor or host. Ex. `+invite mentor XXX or +invite host XXX` Thank you! :partying_face:")
      return
    }

    const results = await speakerInviteSchema.find()
    console.log('Results: ', results)

    const obj = {
      userId: id,
      userName: user.tag,
      speakerRole: args[0].toLowerCase(),
      speakerName : args[1],
      approved: '0',
      hasRewarded: '0'
    }

   await speakerInviteSchema.findOneAndUpdate(obj, obj, {
      upsert: true,
    })

    const embed = new MessageEmbed()
      .setDescription("Thank you for inviting! :fire: An admin will add BRP to your account within 48hr!\nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
    channel.send(embed)
  }
}