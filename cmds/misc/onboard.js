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
      const embed2 = new MessageEmbed()
        .setDescription("{+onboard} command too frequently. :face_with_monocle: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
      channel.send(embed2)
      return
    }

    try {
      const messages = await channel.messages.fetch(0)

      let i = 0
      const filtered = []
      messages.filter((m) => {
        if (m.author.id === id && 1 > i) {
          filtered.push(m)
          i++
        }
      })
      await channel.bulkDelete(filtered, true).then(messages => {
        console.log("message deleted")
      })
    } catch (err) {
      console.error(err)
      channel.send(
        '```css\n[ERROR] ' + err.code + ': [' + err.message + ']\n```'
      )
    }

    const status = await onboardSchema.findOne({ userId: id })
    status ? onBoardStatus = status.onboard : onBoardStatus = 0
    if (onBoardStatus == 1) {
      const embed3 = new MessageEmbed()
        .setDescription("You have already onboard. :man_tipping_hand: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
      channel.send(embed3)
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
      const embed = new MessageEmbed()
        .setDescription("Welcome Onboard! :sunny: \nCheck out [Beta BRP reward system](https://bit.ly/3lzOfRd) for more information about Beta Rewarding System!")
      channel.send(embed)
      const role = guild.roles.cache.find((role) => {
        return role.name === 'founder'
      })
      role && member.roles.add(role)
      console.log("added a founder马甲")
      // log the checkin directly
      updateLogs(id, "onboard")
    }
  }
}