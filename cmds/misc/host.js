const Commando = require('discord.js-commando')
const eventHostSchema = require('@schemas/event-host-schema')
const { MessageEmbed } = require("discord.js")

module.exports = class hostEventCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'host',
      group: 'misc',
      memberName: 'host',
      description: 'Record your hosting for BRP rewards',
      argsType: 'single',
    })
  }

  async run(message, args) {
    const { guild, member, channel } = message
    const { id, user } = member

    // check args input
    console.log(args)

    if (args == '') {
      message.reply("Please specify that which event you hosted. Ex. `+host 6/13 or +invite XXX event` Thank you! :partying_face:")
      return
    }

    const results = await eventHostSchema.find()
    console.log('Results: ', results)

    const obj = {
      userId: id,
      userName: user.tag,
      eventDate: args,
      approved: '0',
      hasRewarded: '0'
    }

    await eventHostSchema.findOneAndUpdate(obj, obj, {
      upsert: true,
    })

    const embed = new MessageEmbed()
      .setDescription("Thank you for hosting! :fire: An admin will add BRP to your account within 48hr!\nCheck out [Beta BRP reward system](https://bit.ly/3yPIuF9) for more information about Beta Rewarding System!")
    channel.send(embed)
  }
}