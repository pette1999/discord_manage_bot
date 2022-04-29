const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
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
    const { guild, member } = message
    const { id } = member
    const user = message.mentions.users.first() || message.member.user

    // if input without code, unable to check in
    if (args === '') {
      message.reply("Wrong command, please add a link to the post :wink:")
      return
    }
    
    console.log('Fetching from mongo')

    await mongo().then(async (mongoose) => {
      try {
        const results = await socialMediaPostSchema.find()
        console.log('Results: ', results)

        const obj = {
          userId: id,
          userName: user.tag,
          postLink: args,
          approved: false,
          hasRewarded: false,
          hasBonus: false,
          like: 0,
          comment: 0,
          share: 0,
        }

        await socialMediaPostSchema.findOneAndUpdate(obj, obj, {
          upsert: true,
        })

        message.reply("Thank you for sharing about Beta! :fire: An admin will check out your submit shortly")

      } finally {
        mongoose.connection.close()
      }
    })
  }
}