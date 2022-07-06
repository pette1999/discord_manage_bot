const Commando = require('discord.js-commando')
const feedbackSchema = require('@schemas/feedback-schema')
const { MessageEmbed } = require("discord.js")

module.exports = class hostEventCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'feedback',
      group: 'misc',
      memberName: 'feedback',
      description: 'Record your feedback for BRP rewards',
      argsType: 'single',
    })
  }

  async run(message, args) {
    const { guild, member, attachments, channel } = message
    const { id, user } = member
    var pictures = ['nothing']
    attachments.forEach((attachment) => {
      pictures[0] = attachment.attachment
    })

    if (args == '') {
      message.reply("Please specify your feedback. Ex. `+feedback 增长必备 not yet translated [link or picture of the feedback]` Thank you! :partying_face:")
      return
    }

    pictures[0]!='nothing' ? args += `, ${pictures[0]}` : args = args

    const results = await feedbackSchema.find()
    console.log('Results: ', results)

    const obj = {
      userId: id,
      userName: user.tag,
      feedback: args,
      approved: '0',
      hasRewarded: '0'
    }

    await feedbackSchema.findOneAndUpdate(obj, obj, {
      upsert: true,
    })

    const embed = new MessageEmbed()
      .setDescription("Thank you for reporting! :fire: An admin will add BRP to your account within 48hr!\nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
    channel.send(embed)
  }
}