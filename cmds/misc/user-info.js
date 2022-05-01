const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
const mongo = require('@util/mongo')
const attendanceSchema = require('@schemas/attendance-schema')
const memberScoreSchema = require('@schemas/member-schema')
let messageSchema = require('@schemas/statbotMessage-schema');
let voiceSchema = require('@schemas/statbotVoice-schema')

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
        const { id } = member
        const inviteCounter = {}
        var attendanceTimes = 0
        var messageCount = 0
        var voiceCount = 0

        await mongo().then(async(mongoose) => {
            try {
                 // get how many attendance from mongodb
                const attendanceArr = await attendanceSchema.findOne({ userId: id }, { "attendance": 1, "_id": 0 }).distinct('attendance')
                attendanceTimes = attendanceArr.length
                // get message count
                const messageArr = await messageSchema.findOne({ userId: id })
                messageCount = parseInt(messageArr['messageCount'])
                // get voice count
                const voiceArr = await voiceSchema.findOne({ userId: id })
                voiceCount = parseInt(voiceArr['voiceCount'])
            } finally {
                mongoose.connection.close()
            }
        })

        guild.fetchInvites().then((invites) => {
            invites.forEach((invite) => {
                const { uses, inviter } = invite
                const { username, discriminator } = inviter

                const name = `${username}#${discriminator}`

                inviteCounter[name] = (inviteCounter[name] || 0) + uses
            })

            console.log(inviteCounter)
            const user = message.member.user
            const member = guild.members.cache.get(user.id)
            console.log("member: ", user.id)

            // console.log(member)
            console.log("Invite: ")
            console.log(inviteCounter[user.tag])

            var score = 0
            typeof inviteCounter[user.tag] != 'undefined' ? score += parseInt(inviteCounter[user.tag]) * 3 : score += 0
            typeof voiceCount != 'undefined' ? score += parseInt(voiceCount) * 0.01 : score += 0
            typeof messageCount != 'undefined' ? score += parseInt(messageCount) * 0.05 : score += 0
            typeof attendanceTimes != 'undefined' ? score += parseInt(attendanceTimes) * 2 : score += 0
            score = parseFloat(score).toFixed(2)

            // await mongo().then(async (mongoose) => {
            //     try {
            //         const obj = {
            //             userId: user.id,
            //             userName: reqString,
            //             nickname: reqString,
            //             numRoles: reqNumber,
            //             invites: reqNumber,
            //             attendance: reqNumber,
            //             message: reqNumber,
            //             voice: reqNumber,
            //             score: reqNumber,
            //             post: reqArray,
            //             postCount: reqNumber,
            //             bonusPost: reqArray,
            //             bonusPostCount: reqNumber,
            //         }
            //     } finally {
            //         mongoose.connection.close()
            //     }
            // })

            const embed = new MessageEmbed()
                .setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
                .addFields({
                    name: 'User tag',
                    value: user.tag,
                }, {
                    name: 'Roles',
                    value: member.roles.cache.size - 1,
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
    }
}