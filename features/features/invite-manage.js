const tempInviteSchema = require('@schemas/tempInvites-schema')
const inviteSchema = require('@schemas/invites-schema')
const updatePoints = require('../../util/update-points')

const manageInvites = async (client) => {
  const tempInviteArr = await tempInviteSchema.find()
  var tempJoined = []
  var old_inviteNum = 0
  var old_inviteArr = []
  var roles = {}
  const guild = client.guilds.cache.get("948732804999553034")
  // get roles
  await guild.members.fetch().then((members) => {
    members.forEach((member) => {
      const { user, _roles } = member
      const { id } = user
      roles[id] = _roles
    })
  })
  // console.log("Temp invite: ")
  // console.log(tempInviteArr)
  if(tempInviteArr) {
    for (var k = 0; k < tempInviteArr.length; k++) {
      var roleVerified = false
      const tempInviteArr_userID = tempInviteArr[k]['user_Id']
      if (!tempJoined.includes(tempInviteArr_userID)) {
        if (typeof roles[tempInviteArr_userID] != 'undefined' && roles[tempInviteArr_userID].includes('954116583620501524')){
          roleVerified = true
        }
        tempJoined.push(tempInviteArr_userID)
        const old_invites = await inviteSchema.findOne({ userId: tempInviteArr[k]['inviter_Id'] })
        if (old_invites) {
          old_inviteNum = parseInt(old_invites['invites'])
          old_inviteArr = old_invites['invite_People']
        }

        if (!old_inviteArr.includes(tempInviteArr_userID)) {
          old_inviteArr.push(tempInviteArr_userID)
          old_inviteNum = parseInt(old_inviteNum) + 1
        }

        const now = new Date()
        const joined = Date.parse(tempInviteArr[k]['joined'])
        const diffHour = Math.round(Math.abs(now - joined) / (1000 * 60 * 60))
        if (diffHour >= 24 && roleVerified == true) {
          // we say that's a formal join, we add invite to the inviter
          obj = {
            userId: tempInviteArr[k]['inviter_Id'],
            userName: tempInviteArr[k]['inviter_userName'],
            invites: String(old_inviteNum),
            invite_People: old_inviteArr,
          }

          // check if the user has the 'Beta Guest' Role
          // add this invite to the database
          await inviteSchema.findOneAndUpdate({ userId: String(tempInviteArr[k]['inviter_Id']) }, obj, {
            upsert: true,
          })
          // log the checkin
          updatePoints(`invite ${tempInviteArr_userID}`, tempInviteArr[k]['inviter_Id'])
          // delete everything associated with this person from tempInviteArr[k] database
          await tempInviteSchema.deleteMany({ user_Id: tempInviteArr_userID })
          console.log(`Deleted ${tempInviteArr_userID} after approved`)
          console.log(obj)
        }
        // sleep for 3 seconds in order for server to process the information
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else {
        await tempInviteSchema.deleteOne({ _id: tempInviteArr[k]['_id'] })
        console.log(`Deleted ${tempInviteArr[k]['_id']} for duplicates`)
      }
    }
  }
  setTimeout(() => {
    manageInvites(client)
  }, 1000 * 60 * 360)
}

module.exports = async (client) => {
  manageInvites(client)
}