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
      argsType: 'multiple',
    })
  }

  async run(message, args) {
    const { guild, member } = message
    const { id } = member
    const user = message.mentions.users.first() || message.member.user
    
    console.log('Fetching from mongo')

    await mongo().then(async (mongoose) => {
      try {
        const results = await socialMediaPostSchema.find()
        console.log('Results: ', results)

        const obj = {
          userId: id,
          userName: user.tag,
          postLink: args[0],
          approved: false,
          hasRewarded: false,
          hasBonus: false,
        }

        await socialMediaPostSchema.findOneAndUpdate(obj, obj, {
          upsert: true,
        })

      } finally {
        mongoose.connection.close()
      }
    })
  }
}