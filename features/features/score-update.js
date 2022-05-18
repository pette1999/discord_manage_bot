const userinfoSchema = require('@schemas/userinfo-schema')
const attendanceSchema = require('@schemas/attendance-schema')
const morningSchema = require('@schemas/morning-schema')
const nightSchema = require('@schemas/night-schema')
const messageSchema = require('@schemas/statbotMessage-schema')
const voiceSchema = require('@schemas/statbotVoice-schema')
const inviteSchema = require('@schemas/invites-schema')
const selfintoSchema = require('@schemas/selfintro-schema')
const postSchema = require('@schemas/socialMedia-post-schema')
const updatePoints = require('../../util/update-points')

const updateScore = async (client) => {
  var userIds = []
  var userNames = []
  var roles = []
  var approvedPosts = []
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

  // fetch posts
  const postArr = await postSchema.find()
  if(postArr){
    postArr.forEach((post) => {
      console.log(post['approved'])
      if (post['approved'] == "article") {
        for (var i = 0; i < 5; i++) approvedPosts.push(post['userId'])
        console.log("post score: ", 5)
        // log the checkin
        updatePoints('post article: ', post['userId'])
      } 
      if (post['approved'] == "video") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        console.log("post score: ", 8)
        // log the checkin
        updatePoints('post video: ', post['userId'])
      } 
      if (post['approved'] == "snapshot") {
        for (var i = 0; i < 2; i++) approvedPosts.push(post['userId'])
        console.log("post score: ", 2)
        // log the checkin
        updatePoints('post snapshot: ', post['userId'])
      } 
      if (post['approved'] == "design") {
        for (var i = 0; i < 3; i++) approvedPosts.push(post['userId'])
        console.log("post score: ", 3)
        // log the checkin
        updatePoints('post poster design: ', post['userId'])
      } 
      if (post['approved'] == "deck") {
        for (var i = 0; i < 8; i++) approvedPosts.push(post['userId'])
        console.log("post score: ", 8)
        // log the checkin
        updatePoints('post deck: ', post['userId'])
      } 
      if (post['approved'] == "lecture") {
        for (var i = 0; i < 10; i++) approvedPosts.push(post['userId'])
        console.log("post score: ", 10)
        // log the checkin
        updatePoints('post lecture video: ', post['userId'])
      } 
      if (post['approved'] == "report") {
        for (var i = 0; i < 20; i++) approvedPosts.push(post['userId'])
        console.log("post score: ", 20)
        // log the checkin
        updatePoints('post report: ', post['userId'])
      }
    })
  }
  console.log(approvedPosts)
  for (let i=0; i<userIds.length; ++i) {
    var attendanceTimes = 0
    var messageCount = 0
    var voiceCount = 0
    var morningCount = 0
    var nightCount = 0
    var inviteCount = 0
    var score = 0
    var selfIntroCount = 0
    var postCount = 0
    var obj = {}

    approvedPosts.forEach(userID => {
      userID == userIds[i] ? postCount += 1 : postCount += 0
    })
    if (userIds[i] == '594946541387513858') {
      console.log("postCount: ", postCount)
    }
    //console.log(i, ",", userIds[i], ",", userNames[i], ",", roles[i])
    const inviteArr = await inviteSchema.findOne({ userId: userIds[i] })
    inviteArr ? inviteCount = parseInt(inviteArr['invites']) : inviteCount = 0
    const attendanceArr = await attendanceSchema.findOne({ userId: userIds[i] }).distinct('attendance')
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

    // typeof inviteCounter[userNames[i]] != 'undefined' ? score += parseInt(inviteCounter[userNames[i]]) * 3 : score += 0
    typeof inviteCount != 'undefined' ? score += parseInt(inviteCount) * 3 : score += 0
    typeof voiceCount != 'undefined' ? score += parseInt(voiceCount) * 0.01 : score += 0
    typeof messageCount != 'undefined' ? score += parseInt(messageCount) * 0.05 : score += 0
    typeof attendanceTimes != 'undefined' ? score += parseInt(attendanceTimes) * 2 : score += 0
    typeof morningCount != 'undefined' ? score += parseInt(morningCount) * 0.1 : score += 0
    typeof nightCount != 'undefined' ? score += parseInt(nightCount) * 0.1 : score += 0
    typeof selfIntroCount != 'undefined' ? score += parseInt(selfIntroCount) * 5 : score += 0
    postCount > 0 ? score += parseInt(postCount) : score += 0
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