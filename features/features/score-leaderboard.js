const { MessageEmbed } = require('discord.js')
const mongo = require('@util/mongo')
const userinfoSchema = require('@schemas/userinfo-schema')
const attendanceSchema = require('@schemas/attendance-schema')
const morningSchema = require('@schemas/morning-schema')
const nightSchema = require('@schemas/night-schema')
const messageSchema = require('@schemas/statbotMessage-schema')
const voiceSchema = require('@schemas/statbotVoice-schema')

const fetchTopMembers = async (client) => {
  var userIds = []
  var userNames = []
  var roles = []
  var inviteCounter = {}
  var attendanceTimes = 0
  var messageCount = 0
  var voiceCount = 0
  var morningCount = 0
  var nightCount = 0
  var score = 0
  var obj = {}
  const guild = client.guilds.cache.get("948732804999553034")
  await mongo().then(async(mongoose) => {
    try {
      const ids = await userinfoSchema.find({})
      for (id of ids) {
        userIds.push(id.user_Id)
        userNames.push(id.user_Name)
        roles.push(id.user_Roles)
      }
      console.log("userIds: ", userIds)
      console.log("user_Name: ", userNames)
      console.log("user_Roles: ", roles)

      for (let i=0; i<userIds.length; ++i) {
        console.log(i)
        console.log(userIds[i])
        var tempId = userIds[i]
        const attendanceArr = await attendanceSchema.findOne({ userId: tempId }).distinct('attendance')
        attendanceTimes = attendanceArr.length
        const messageArr = await messageSchema.findOne({ userId: tempId })
        messageCount = parseInt(messageArr['messageCount'])
        const voiceArr = await voiceSchema.findOne({ userId: tempId })
        voiceCount = parseInt(voiceArr['voiceCount'])
        morningCount = await morningSchema.findOne({ userId: tempId }).morningCount
        nightCount = await nightSchema.findOne({ userId: tempId }).nightCount

        await guild.fetchInvites().then((invites) => {
          invites.forEach((invite) => {
            const { uses, inviter } = invite
            const { username, discriminator } = inviter

            const name = `${username}#${discriminator}`

            inviteCounter[name] = (inviteCounter[name] || 0) + uses
          })
          console.log(inviteCounter)
          typeof inviteCounter[userNames[i]] != 'undefined' ? score += parseInt(inviteCounter[userNames[i]]) * 3 : score += 0
          typeof voiceCount != 'undefined' ? score += parseInt(voiceCount) * 0.01 : score += 0
          typeof messageCount != 'undefined' ? score += parseInt(messageCount) * 0.05 : score += 0
          typeof attendanceTimes != 'undefined' ? score += parseInt(attendanceTimes) * 2 : score += 0
          typeof morningCount != 'undefined' ? score += parseInt(morningCount) * 0 : score += 0
          typeof nightCount != 'undefined' ? score += parseInt(nightCount) * 0 : score += 0
          score = parseFloat(score).toFixed(2)

          obj = {
            user_Id: String(tempId),
            user_Name: String(userNames[i]),
            user_Roles: String(roles[i]),
            user_Invites: String(inviteCounter[userNames[i]] || 0),
            user_Attendances: String(attendanceTimes || 0),
            user_Messages: String(messageCount || 0),
            user_Voices: String(voiceCount || 0),
            user_Points: score || 0,
          }
        })
        console.log("Obj: ", obj)
        // await userinfoSchema.findOneAndUpdate({ user_Id: String(tempId) }, obj, {
        //   upsert: true,
        // })
      }
    } finally {
      mongoose.connection.close()
    }
  })
}

const updateLeaderboard = async (client) => {
  // fetchTopMembers(client)
  let text = ''
  let numbers = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':ten:']

  await mongo().then(async (mongoose) => {
    try {
      const results = await userinfoSchema.find({}).sort({
        user_Points: -1,
      }).limit(10)

      for (let counter=0; counter<results.length; ++counter) {
        const { user_Id, user_Points = 0 } = results[counter]
        if(counter==0){
          text += `${numbers[counter]} - :first_place: <@${user_Id}>: **${user_Points}** BRPs\n`
        } else if(counter == 1){
          text += `${numbers[counter]} - :second_place: <@${user_Id}>: **${user_Points}** BRPs\n`
        } else if(counter == 2){
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
          
          if (firstMessage) {
            firstMessage.edit(embed)
          } else {
            channel.send(embed)
          }
        }
      }
      setTimeout(() => {
        updateLeaderboard(client)
      }, 1000 * 60 * 60)
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports = async (client) => {
  updateLeaderboard(client)
}