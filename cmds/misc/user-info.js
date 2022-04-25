const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
let statbot_message = require('../../statbot/data/message.json');
let statbot_voice = require('../../statbot/data/voice.json')

module.exports = class UserInfoCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            group: 'misc',
            memberName: 'userinfo',
            description: 'Displays information a user',
        })
    }

    run = async(message) => {
        const { guild, channel } = message
        const inviteCounter = {}
        const messageCounter = {}
        const voiceCounter = {}

        for (const m of statbot_message) {
            messageCounter[m['membertag']] = m['count']
        }
        for (const m of statbot_voice) {
            voiceCounter[m['membertag']] = m['count']
        }

        guild.fetchInvites().then((invites) => {
            invites.forEach((invite) => {
                const { uses, inviter } = invite
                const { username, discriminator } = inviter

                const name = `${username}#${discriminator}`

                inviteCounter[name] = (inviteCounter[name] || 0) + uses
            })

            console.log(inviteCounter)
            const user = message.mentions.users.first() || message.member.user
            const member = guild.members.cache.get(user.id)

            // console.log(member)
            console.log("Invite: ")
            console.log(inviteCounter[user.tag])

            const embed = new MessageEmbed()
                .setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
                .addFields({
                    name: 'User tag',
                    value: user.tag,
                }, {
                    name: 'Nickname',
                    value: member.nickname || 'None',
                }, {
                    name: 'Joined Server',
                    value: new Date(member.joinedTimestamp).toLocaleDateString(),
                }, {
                    name: 'Joined Discord',
                    value: new Date(user.createdTimestamp).toLocaleDateString(),
                }, {
                    name: 'Roles',
                    value: member.roles.cache.size - 1,
                }, {
                    name: 'invites',
                    value: inviteCounter[user.tag],
                }, {
                    name: 'Message Count',
                    value: messageCounter[user.tag],
                }, {
                    name: 'Voice Count',
                    value: voiceCounter[user.tag],
                }, {
                    name: 'Score',
                    value: parseInt(inviteCounter[user.tag]) * 3 + parseInt(voiceCounter[user.tag]) * 0.01 + parseInt(messageCounter[user.tag]) * 0.05,
                })

            channel.send(embed)
        })
    }
}