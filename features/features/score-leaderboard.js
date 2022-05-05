const { MessageEmbed } = require('discord.js')
const userinfoSchema = require('@schemas/userinfo-schema')
const scoreUpdate = require('./score-update')

const updateLeaderboard = async (client) => {
  // fetchTopMembers(client)
  let text = ''
  let numbers = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:']

  const results = await userinfoSchema.find({}).sort({
    user_Points: -1,
  }).limit(10)

  for (let counter = 0; counter < results.length; ++counter) {
    const { user_Id, user_Points = 0 } = results[counter]
    if (counter == 0) {
      text += `${numbers[counter]} - :first_place: <@${user_Id}>: **${user_Points}** BRPs\n`
    } else if (counter == 1) {
      text += `${numbers[counter]} - :second_place: <@${user_Id}>: **${user_Points}** BRPs\n`
    } else if (counter == 2) {
      text += `${numbers[counter]} - :third_place: <@${user_Id}>: **${user_Points}** BRPs\n`
    } else {
      text += `${numbers[counter]} - <@${user_Id}>: **${user_Points}** BRPs\n`
    }
  }

  const guild = client.guilds.cache.get("948732804999553034")
  if (guild) {
    const channel = guild.channels.cache.get("970489951697387581")
    if (channel) {
      const messages = await channel.messages.fetch()
      const firstMessage = messages.first()

      const embed = new MessageEmbed()
        .setColor('#FFD42B')
        .setTitle('Hall of Fame')
        .setThumbnail('https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png')
        .addFields({
          name: 'Beta Fellowship Members',
          value: text
        })
        .setTimestamp()

      channel.send(embed)
    }
  }
  setTimeout(() => {
    updateLeaderboard(client)
  }, 1000 * 60 * 60)
}

module.exports = async (client) => {
  scoreUpdate(client)
  updateLeaderboard(client)
}