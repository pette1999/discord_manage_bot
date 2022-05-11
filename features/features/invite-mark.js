const { MessageEmbed } = require('discord.js')
const tempInviteSchema = require('@schemas/tempInvites-schema')
const userinfoSchema = require('@schemas/userinfo-schema')
const inviteSchema = require('@schemas/invites-schema')

const markTempInvites = async (client) => {
  const invites = {} // { guildId: { memberId: count } }
  const getInviteCounts = async (guild) => {
    return await new Promise((resolve) => {
      guild.fetchInvites().then((invites) => {
        const inviteCounter = {} // { memberId: count }

        invites.forEach((invite) => {
          const { uses, inviter } = invite
          const { username, discriminator } = inviter

          const name = `${username}#${discriminator}`

          inviteCounter[name] = (inviteCounter[name] || 0) + uses
        })

        resolve(inviteCounter)
      })
    })
  }
  client.guilds.cache.forEach(async (guild) => {
    invites[guild.id] = await getInviteCounts(guild)
  })

  client.on('guildMemberAdd', async (member) => {
    const { guild, id, joinedTimestamp, user } = member
    const { username, discriminator } = user
    const name = `${username}#${discriminator}`
    console.log(name)
    console.log(id)
    console.log(joinedTimestamp)

    const invitesBefore = invites[guild.id]
    const invitesAfter = await getInviteCounts(guild)

    console.log('BEFORE:', invitesBefore)
    console.log('AFTER:', invitesAfter)

    for (const inviter in invitesAfter) {
      if (invitesBefore[inviter] === invitesAfter[inviter] - 1) {
        const channelId = '954236100434620416'
        const channel = guild.channels.cache.get(channelId)
        const count = invitesAfter[inviter]
        var inviterID = ''
        const inviterUser = await userinfoSchema.findOne({ user_Name: inviter })
        if (inviterUser) {
          inviterID = inviterUser['user_Id']
        }
        // get inviter real invites
        const inviteArr = await inviteSchema.findOne({ userId: inviterUser['user_Id'] })
        var inviter_real_Invites = 0
        var inviter_temp_Invites = 0
        inviteArr ? inviter_real_Invites = inviteArr['invites'] : inviter_real_Invites = 0
        // get inviter temp invites
        const temp_inviteArr = await tempInviteSchema.find({ inviter_Id: inviterUser['user_Id']})
        temp_inviteArr ? inviter_temp_Invites = temp_inviteArr.length + 1 : inviter_temp_Invites = 1

        var obj = {
          user_Id: id,
          user_Name: name,
          inviter_Id: inviterID,
          inviter_userName: inviter,
          joined: new Date(),
        }

        await tempInviteSchema.findOneAndUpdate(obj, obj, {
          upsert: true,
        })

        channel.send(`Please welcome <@${id}> to the Discord! Invited by <@${inviterID}>(${inviter_real_Invites} regular, ${inviter_temp_Invites} pending)`)

        invites[guild.id] = invitesAfter
        return
      }
    }
  })

  client.on('guildMemberRemove', async (member) => {
    console.log("Left: ", member.id)
    tempUser = await tempInviteSchema.findOne({ user_Id: member.id })
    console.log(tempUser)
    if(tempUser) {
      // if the left member is in the temp invite waitlist, then we delete all the information related to this user in the temp invite database
      await tempInviteSchema.deleteMany({ user_Id: member.id })
      console.log(`${member.id} removed from the server.`)
    }
  })
}

module.exports = async (client) => {
  markTempInvites(client)
}