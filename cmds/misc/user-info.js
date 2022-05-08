const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
const userinfoSchema = require('@schemas/userinfo-schema')

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
    var obj = {}

    console.log("Guild ID: ", guild.id)
    console.log("Channel ID: ", channel.id)

    const userArr = await userinfoSchema.findOne({ user_Id: id })
    if (userArr) {
      obj = {
        user_Id: String(userArr['user_Id']),
        user_Name: String(userArr['user_Name']),
        user_Roles: String(userArr['user_Roles']),
        user_Invites: String(userArr['user_Invites'] || 0),
        user_Attendances: String(userArr['user_Attendances'] || 0),
        user_Messages: String(userArr['user_Messages'] || 0),
        user_Voices: String(userArr['user_Voices'] || 0),
        user_Points: userArr['user_Points'] || 0,
      }
    }

    const embed = new MessageEmbed()
      .setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
      .addFields({
        name: 'User tag',
        value: userArr['user_Name'],
      }, {
        name: 'Roles',
        value: userArr['user_Roles'],
      }, {
        name: 'Invitation',
        value: userArr['user_Invites'] || 0,
      }, {
        name: 'Attendance',
        value: userArr['user_Attendances'] || 0,
      }, {
        name: 'Message Count',
        value: userArr['user_Messages'] || 0,
      }, {
        name: 'Voice Count (min)',
        value: userArr['user_Voices'] || 0,
      }, {
        name: 'Beta Reputation Points',
        value: userArr['user_Points'] || 0,
      })

    channel.send(embed)

    console.log(obj)
  }
}