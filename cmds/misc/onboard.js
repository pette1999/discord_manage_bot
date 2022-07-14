const Commando = require('discord.js-commando')
const onboardSchema = require('@schemas/onboard-schema')
const updateLogs = require('../../util/update-logs')
const { MessageEmbed } = require('discord.js')

let onboardCache = []

const clearCache = () => {
  onboardCache = []
  setTimeout(clearCache, 1000 * 60 * 60 * 0)
}
clearCache()

module.exports = class onboardCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'onboard',
      group: 'misc',
      memberName: 'onboard',
      description: 'Finished the onboarding',
    })
  }

  async run(message) {
    const { member, channel } = message
    const { id } = member
    const user = member.user
    var onBoardStatus = 0

    if (onboardCache.includes(id)) {
      console.log('Returning from cache')
      message.reply("{+onboard} command too frequently. :face_with_monocle: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
      return
    }

    const status = await onboardSchema.findOne({ userId: id })
    status ? onBoardStatus = status.onboard : onBoardStatus = 0
    if (onBoardStatus == 1) {
      message.reply("You have already onboard. :man_tipping_hand: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
      return
    } else {
      const obj = {
        userId: id,
        userName: user.tag,
        onboard: 1,
      }

      await onboardSchema.findOneAndUpdate({ userId: id }, obj, {
        upsert: true,
      })

      onboardCache.push(id)
      const embed2 = new MessageEmbed("Welcome Onboard! :sunny: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
        .setDescription()
      console.log("hahah")
      channel.send(embed2)
      // log the checkin directly
      updateLogs(id, "onboard")
    }
  }
}