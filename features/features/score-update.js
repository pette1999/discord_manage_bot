const userinfoSchema = require('@schemas/userinfo-schema')
const attendanceSchema = require('@schemas/attendance-schema')
const morningSchema = require('@schemas/morning-schema')
const nightSchema = require('@schemas/night-schema')
const messageSchema = require('@schemas/statbotMessage-schema')
const voiceSchema = require('@schemas/statbotVoice-schema')
const inviteSchema = require('@schemas/invites-schema')

const updateScore = async (client) => {
  var userIds = []
  var userNames = []
  var roles = []
  var inviteCounter = {}
  var invitePeople = {}
  const guild = client.guilds.cache.get("948732804999553034")

  // Fetch all members
  await guild.members.fetch().then((members) => {
    members.forEach((member) => {
      const { user, _roles } = member
      const { id, username, discriminator } = user
      // console.log(count, ": ", id, ", ", username)
      userIds.push(id)
      userNames.push(username + '#' + discriminator)
      roles.push(_roles.length)
    })
  })

  // console.log("userIds: ", userIds)
  // console.log("user_Name: ", userNames)
  // console.log("user_Roles: ", roles)

  // fetch invites
  await guild.fetchInvites().then((invites) => {
    invites.forEach((invite) => {
      const { uses, inviter } = invite
      const { id, username, discriminator } = inviter
      const name = `${username}#${discriminator}`

      inviteCounter[name] = (inviteCounter[name] || 0) + uses
      invitePeople[name] = id
    })
  })
  // console.log(inviteCounter)
  // console.log(invitePeople)

  for (let i=0; i<userIds.length; ++i) {
    var attendanceTimes = 0
    var messageCount = 0
    var voiceCount = 0
    var morningCount = 0
    var nightCount = 0
    var inviteCount = 0
    var score = 0
    var obj = {}
    //console.log(i, ",", userIds[i], ",", userNames[i], ",", roles[i])
    const inviteArr = await inviteSchema.findOne({ userId: userIds[i] })
    if(inviteArr) {
      inviteCount = parseInt(inviteArr['invites'])
    } else {
      inviteCount = 0
    }
    const attendanceArr = await attendanceSchema.findOne({ userId: userIds[i] }).distinct('attendance')
    attendanceTimes = attendanceArr.length
    const messageArr = await messageSchema.findOne({ userId: userIds[i] })
    if (messageArr) {
      messageCount = parseInt(messageArr['messageCount'])
    } else {
      messageCount = 0
    }
    const voiceArr = await voiceSchema.findOne({ userId: userIds[i] })
    if (voiceArr) {
      voiceCount = parseInt(voiceArr['voiceCount'])
    } else {
      voiceCount = 0
    }
    morningCount = await morningSchema.findOne({ userId: userIds[i] }).morningCount
    if (!morningCount) {
      morningCount = 0
    }
    nightCount = await nightSchema.findOne({ userId: userIds[i] }).nightCount
    if (!nightCount) {
      nightCount = 0
    }

    // typeof inviteCounter[userNames[i]] != 'undefined' ? score += parseInt(inviteCounter[userNames[i]]) * 3 : score += 0
    typeof inviteCount != 'undefined' ? score += parseInt(inviteCount) * 3 : score += 0
    typeof voiceCount != 'undefined' ? score += parseInt(voiceCount) * 0.01 : score += 0
    typeof messageCount != 'undefined' ? score += parseInt(messageCount) * 0.05 : score += 0
    typeof attendanceTimes != 'undefined' ? score += parseInt(attendanceTimes) * 2 : score += 0
    typeof morningCount != 'undefined' ? score += parseInt(morningCount) * 0 : score += 0
    typeof nightCount != 'undefined' ? score += parseInt(nightCount) * 0 : score += 0
    score = parseFloat(score).toFixed(2)

    obj = {
      user_Id: String(userIds[i]),
      user_Name: String(userNames[i]),
      user_Roles: String(roles[i]),
      user_Invites: String(inviteCount || 0),
      user_Attendances: String(attendanceTimes || 0),
      user_Messages: String(messageCount || 0),
      user_Voices: String(voiceCount || 0),
      user_Points: score || 0,
    }

    // console.log(obj)
    await userinfoSchema.findOneAndUpdate({ user_Id: String(userIds[i]) }, obj, {
      upsert: true,
    })
  }

  setTimeout(() => {
    updateScore(client)
  }, 1000 * 60 * 10)
}

module.exports = async (client) => {
  updateScore(client)
}