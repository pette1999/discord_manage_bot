const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
const attendanceSchema = require('@schemas/attendance-schema')
const memberScoreSchema = require('@schemas/member-schema')
const morningSchema = require('@schemas/morning-schema')
const nightSchema = require('@schemas/night-schema')
const userinfoSchema = require('@schemas/userinfo-schema')
const messageSchema = require('@schemas/statbotMessage-schema')
const voiceSchema = require('@schemas/statbotVoice-schema')

module.exports = class UserInfoCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      group: 'misc',
      memberName: 'userinfo',
      description: 'Displays information a user',
    })
  }

  async run(message) {
    const { guild, channel, member } = message
    const { id, user, roles } = member
    var inviteCounter = {}
    var attendanceTimes = 0
    var messageCount = 0
    var voiceCount = 0
    var morningCount = 0
    var nightCount = 0
    var score = 0
    var obj = {}

    console.log("Guild ID: ", guild.id)
    console.log("Channel ID: ", channel.id)

    // get how many attendance from mongodb
    const attendanceArr = await attendanceSchema.findOne({ userId: id }, { "attendance": 1, "_id": 0 }).distinct('attendance')
    attendanceTimes = attendanceArr.length
    // get message count
    const messageArr = await messageSchema.findOne({ userId: id })
    messageCount = parseInt(messageArr['messageCount'])
    // get voice count
    const voiceArr = await voiceSchema.findOne({ userId: id })
    voiceCount = parseInt(voiceArr['voiceCount'])
    // get morning count
    morningCount = await morningSchema.findOne({ userId: id }).morningCount
    // get night count
    nightCount = await nightSchema.findOne({ userId: id }).nightCount

    await guild.fetchInvites().then((invites) => {
      invites.forEach((invite) => {
        const { uses, inviter } = invite
        const { username, discriminator } = inviter

        const name = `${username}#${discriminator}`

        inviteCounter[name] = (inviteCounter[name] || 0) + uses
      })
      console.log(inviteCounter)
      typeof inviteCounter[user.tag] != 'undefined' ? score += parseInt(inviteCounter[user.tag]) * 3 : score += 0
      typeof voiceCount != 'undefined' ? score += parseInt(voiceCount) * 0.01 : score += 0
      typeof messageCount != 'undefined' ? score += parseInt(messageCount) * 0.05 : score += 0
      typeof attendanceTimes != 'undefined' ? score += parseInt(attendanceTimes) * 2 : score += 0
      typeof morningCount != 'undefined' ? score += parseInt(morningCount) * 0 : score += 0
      typeof nightCount != 'undefined' ? score += parseInt(nightCount) * 0 : score += 0
      score = parseFloat(score).toFixed(2)

      obj = {
        user_Id: String(id),
        user_Name: String(user.tag),
        user_Roles: String(roles.cache.size - 1),
        user_Invites: String(inviteCounter[user.tag] || 0),
        user_Attendances: String(attendanceTimes || 0),
        user_Messages: String(messageCount || 0),
        user_Voices: String(voiceCount || 0),
        user_Points: score || 0,
      }

      const embed = new MessageEmbed()
        .setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
        .addFields({
          name: 'User tag',
          value: user.tag,
        }, {
          name: 'Roles',
          value: roles.cache.size - 1,
        }, {
          name: 'Invitation',
          value: inviteCounter[user.tag] || 0,
        }, {
          name: 'Attendance',
          value: attendanceTimes || 0,
        }, {
          name: 'Message Count',
          value: messageCount || 0,
        }, {
          name: 'Voice Count (min)',
          value: voiceCount || 0,
        }, {
          name: 'Beta Reputation Points',
          value: score || 0,
        })

      channel.send(embed)
    })

    console.log(obj)

    await userinfoSchema.findOneAndUpdate({ user_Id: String(id) }, obj, {
      upsert: true,
    })
  }
}