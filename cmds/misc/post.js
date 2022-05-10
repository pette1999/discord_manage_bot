const Commando = require('discord.js-commando')
const socialMediaPostSchema = require('@schemas/socialMedia-post-schema')

module.exports = class postCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'post',
      group: 'misc',
      memberName: 'post',
      description: 'Post about Beta to get rewards',
      argsType: 'single',
    })
  }

  async run(message, args) {
    const { guild, member, attachments } = message
    const { id } = member
    const user = message.mentions.users.first() || message.member.user
    var pictures = ['nothing']
    attachments.forEach((attachment) => {
      pictures[0] = attachment.attachment
    })
    // if input without code, unable to check in
    if (args == '' && !attachments) {
      message.reply("Wrong command, please add a link to the post :wink:")
      return
    }
    pictures[0]!='nothing' ? args = pictures[0] : args = args
    
    console.log('Fetching from mongo')

    const results = await socialMediaPostSchema.find()
    console.log('Results: ', results)

    const obj = {
      userId: id,
      userName: user.tag,
      postLink: args,
      approved: '0',
      hasRewarded: '0',
      hasBonus: '0',
      like: '0',
      comment: '0',
      share: '0',
    }

    await socialMediaPostSchema.findOneAndUpdate(obj, obj, {
      upsert: true,
    })

    message.reply("Thank you for sharing about Beta! :fire: An admin will check out your submission shortly")
  }
}