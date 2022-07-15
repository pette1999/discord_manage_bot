const userinfoSchema = require('@schemas/userinfo-schema')
const attendanceSchema = require('@schemas/attendance-schema')
const morningSchema = require('@schemas/morning-schema')
const nightSchema = require('@schemas/night-schema')
const messageSchema = require('@schemas/statbotMessage-schema')
const voiceSchema = require('@schemas/statbotVoice-schema')
const inviteSchema = require('@schemas/invites-schema')
const selfintoSchema = require('@schemas/selfintro-schema')
const fetchPosts = require('../../util/fetch-posts')
const onboardSchema = require('@schemas/onboard-schema')

const updateScore = async (client) => {
  var userIds = []
  var userNames = []
  var roles = []
  var approvedPosts = []
  var approvedPostsCount = []
  var speakerInvites = []
  var speakerInvitesCount = []
  var eventHosts = []
  var eventHostsCount = []
  var feedbacks = []
  var feedbacksCount = []
  var inviteCounter = {}
  var invitePeople = {}
  const guild = client.guilds.cache.get("948732804999553034")

  // Fetch all members
  await guild.members.fetch().then((members) => {
    members.forEach((member) => {
      const { user, _roles } = member
      const { id, username, discriminator } = user
      // console.log(count, ": ", id, ", ", username)
      if(!userIds.includes(id)){
        userIds.push(id)
        userNames.push(username + '#' + discriminator)
        roles.push(_roles.length)
      }
    })
  })

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

  // fetch posts
  await fetchPosts(client, approvedPosts, approvedPostsCount, speakerInvites, speakerInvitesCount, eventHosts, eventHostsCount, feedbacks, feedbacksCount)
  console.log("Speaker Invites: ", speakerInvites)

  for (let i=0; i<userIds.length; ++i) {
    var attendanceTimes = 0
    var messageCount = 0
    var voiceCount = 0
    var morningCount = 0
    var nightCount = 0
    var inviteCount = 0
    var score = 0
    var selfIntroCount = 0
    var onboardStatus = 0
    var postCount = 0
    var postCountValue = 0
    var speakerInviteCount = 0
    var speakerInviteCountValue = 0
    var eventHostCount = 0
    var eventHostCountValue = 0
    var feedbackCount = 0
    var feedbackCountValue = 0
    var obj = {}

    approvedPosts.forEach(userID => {
      userID == userIds[i] ? postCount += 1 : postCount += 0
    })
    approvedPostsCount.forEach(userID => {
      userID == userIds[i] ? postCountValue += 1 : postCountValue += 0
    })
    speakerInvites.forEach(userID => {
      userID == userIds[i] ? speakerInviteCount += 1 : speakerInviteCount += 0
    })
    speakerInvitesCount.forEach(userID => {
      userID == userIds[i] ? speakerInviteCountValue += 1 : speakerInviteCountValue += 0
    })
    eventHosts.forEach(userID => {
      userID == userIds[i] ? eventHostCount += 1 : eventHostCount += 0
    })
    eventHostsCount.forEach(userID => {
      userID == userIds[i] ? eventHostCountValue += 1 : eventHostCountValue += 0
    })
    feedbacks.forEach(userID => {
      userID == userIds[i] ? feedbackCount += 1 : feedbackCount += 0
    })
    feedbacksCount.forEach(userID => {
      userID == userIds[i] ? feedbackCountValue += 1 : feedbackCountValue += 0
    })
    //console.log(i, ",", userIds[i], ",", userNames[i], ",", roles[i])
    const inviteArr = await inviteSchema.findOne({ userId: userIds[i] })
    inviteArr ? inviteCount = parseInt(inviteArr['invites']) : inviteCount = 0
    const attendanceArr = await attendanceSchema.findOne({ userId: userIds[i] }).distinct('attendance')
    attendanceArr.includes("2022-07-13") ? score += 8 : score += 0
    attendanceTimes = attendanceArr.length
    const messageArr = await messageSchema.findOne({ userId: userIds[i] })
    messageArr ? messageCount = parseInt(messageArr['messageCount']) : messageCount = 0
    const voiceArr = await voiceSchema.findOne({ userId: userIds[i] })
    voiceArr ? voiceCount = parseInt(voiceArr['voiceCount']) : voiceCount = 0
    const morning = await morningSchema.findOne({ userId: userIds[i] })
    morning ? morningCount = parseInt(morning['morningCount']) : morningCount = 0
    const night = await nightSchema.findOne({ userId: userIds[i] })
    night ? nightCount = parseInt(night['nightCount']) : nightCount = 0
    const selfIntro = await selfintoSchema.findOne({ user_Id: userIds[i] })
    selfIntro ? selfIntroCount = parseInt(selfIntro['has_Introduced']) : selfIntroCount = 0
    const onBoard = await onboardSchema.findOne({ userId: userIds[i] })
    onBoard ? onboardStatus = parseInt(onBoard['onboard'].length) : onboardStatus = 0

    // for using the checkin code Bootcamp

    // typeof inviteCounter[userNames[i]] != 'undefined' ? score += parseInt(inviteCounter[userNames[i]]) * 3 : score += 0
    typeof inviteCount != 'undefined' ? score += parseInt(inviteCount) * 2 : score += 0
    typeof voiceCount != 'undefined' ? score += parseInt(voiceCount) * 0.0005 : score += 0
    typeof messageCount != 'undefined' ? score += parseInt(messageCount) * 0.05 : score += 0
    typeof attendanceTimes != 'undefined' ? score += parseInt(attendanceTimes) * 2 : score += 0
    typeof morningCount != 'undefined' ? score += parseInt(morningCount) * 0.1 : score += 0
    typeof nightCount != 'undefined' ? score += parseInt(nightCount) * 0.1 : score += 0
    typeof selfIntroCount != 'undefined' ? score += parseInt(selfIntroCount) * 5 : score += 0
    typeof onboardStatus != 'undefined' ? score += parseInt(onboardStatus) * 20 : score += 0
    // add points for posts
    postCount > 0 ? score += parseInt(postCount) : score += 0
    // add points for inviting hosts or mentors
    speakerInviteCount > 0 ? score += parseInt(speakerInviteCount) : score += 0
    // add points for hosting an event
    eventHostCount > 0 ? score += parseInt(eventHostCount) : score += 0
    score = parseFloat(score).toFixed(2)

    obj = {
      user_Id: String(userIds[i]),
      user_Name: String(userNames[i]),
      user_Roles: String(roles[i]),
      user_Invites: String(inviteCount || 0),
      user_Attendances: String(attendanceTimes || 0),
      user_Messages: String(messageCount || 0),
      user_Voices: String(voiceCount || 0),
      user_Posts: postCountValue || 0,
      user_Points: score || 0,
    }

    await userinfoSchema.findOneAndUpdate({ user_Id: String(userIds[i]) }, obj, {
      upsert: true,
    })
  }
  await new Promise(resolve => setTimeout(resolve, 3000))

  setTimeout(() => {
    updateScore(client)
  }, 1000 * 60 * 10)
}

module.exports = async (client) => {
  updateScore(client)
}