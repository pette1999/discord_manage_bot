const { MessageEmbed } = require('discord.js')
const userinfoSchema = require('@schemas/userinfo-schema')
const weeklyBoard = require('@schemas/weekly-board-schema')
const scoreUpdate = require('./score-update')
const scoreWeekly = require('./score-weekly')

const updateLeaderboard = async (client) => {
  // fetchTopMembers(client)
  let text = ''
  let weekly_text = ''
  let numbers = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:']

  await scoreUpdate(client)
  await new Promise(resolve => setTimeout(resolve, 1000 * 30))
  await scoreWeekly(client)
  await new Promise(resolve => setTimeout(resolve, 1000 * 30))
  const results = await userinfoSchema.find({}).sort({
    user_Points: -1,
  }).limit(10)
  const weekly_results = await weeklyBoard.find({}).sort({
    weeklyScore: -1,
  }).collation({ locale: "en_US", numericOrdering: true }).limit(10)

  console.log(weekly_results)

  for (let counter = 0; counter < results.length; ++counter) {
    const { user_Id, user_Points = 0 } = results[counter]
    const { userId, weeklyScore = 0 } = weekly_results[counter]
    if (counter == 0) {
      text += `${numbers[counter]} - :first_place: <@${user_Id}>: **${user_Points}** BRPs\n`
      weekly_text += `${numbers[counter]} - :first_place: <@${userId}>: **${weeklyScore}** BRPs\n`
    } else if (counter == 1) {
      text += `${numbers[counter]} - :second_place: <@${user_Id}>: **${user_Points}** BRPs\n`
      weekly_text += `${numbers[counter]} - :second_place: <@${userId}>: **${weeklyScore}** BRPs\n`
    } else if (counter == 2) {
      text += `${numbers[counter]} - :third_place: <@${user_Id}>: **${user_Points}** BRPs\n`
      weekly_text += `${numbers[counter]} - :third_place: <@${userId}>: **${weeklyScore}** BRPs\n`
    } else {
      text += `${numbers[counter]} - <@${user_Id}>: **${user_Points}** BRPs\n`
      weekly_text += `${numbers[counter]} - <@${userId}>: **${weeklyScore}** BRPs\n`
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
        .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
        .setTimestamp()
      
      const embed_weekly = new MessageEmbed()
        .setColor('#FFD42B')
        .setTitle('Hall of Fame(Weekly)')
        .setThumbnail('https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png')
        .addFields({
          name: 'Beta Fellowship Members',
          value: weekly_text
        })
        .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
        .setTimestamp()

      channel.send(embed).then((message) => {
        setTimeout(() => {
          message.delete()
        }, 1000 * 60 * 359)
      })

      channel.send(embed_weekly).then((message) => {
        setTimeout(() => {
          message.delete()
        }, 1000 * 60 * 359)
      })
    }
  }
  setTimeout(() => {
    updateLeaderboard(client)
  }, 1000 * 60 * 360)
}

module.exports = async (client) => {
  updateLeaderboard(client)
}