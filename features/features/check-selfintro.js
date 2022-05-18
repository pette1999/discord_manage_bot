const selfintoSchema = require('@schemas/selfintro-schema')
const updatePoints = require('../../util/update-points')

const checkSelfIntro = async (client) => {
  const guild = client.guilds.cache.get("948732804999553034")
  var selfIntro_ids = []

  // if (guild) {
  //   const channel = guild.channels.cache.get("948735056355139614")
  //   if(channel) {
  //     await channel.messages.fetch({ limit: 100 }).then((messages) => {
  //       messages.forEach((message) => {
  //         const { author } = message
  //         const { id } = author
  //         selfIntro_ids.push(id)
  //       })
  //     })
  //     for (var i=0; i < selfIntro_ids.length; i++){
  //       const selfIntro = await selfintoSchema.findOne({ user_Id: selfIntro_ids[i] })
  //       if(selfIntro) {
  //         if (selfIntro['has_Introduced'] == "0") {
  //           await selfintoSchema.updateOne({ user_Id: selfIntro_ids[i] }, { "$set": { "has_Introduced": "1" } })
  //         }
  //       }
  //     }
  //   }
  // }

  client.on("message", async msg => {
    const { channel, content, author } = msg
    const { id } = channel
    if (id == '948735056355139614' && content.split(" ").length >= 50 && author.id != '964864728109301760') {
      await selfintoSchema.findOneAndUpdate({ user_Id: author.id }, { "$set": { "has_Introduced": "1" } }, { upsert: true })
      // log the checkin
      updatePoints("self-intro with bonus", author.id)
      console.log(`${author.id} has successfully self introduced and won a bonus!`)
      await channel.send(`<@${author.id}> has successfully self introduced and won a bonus!`).then((message) => {
        setTimeout(() => {
          message.delete()
        }, 1000 * 60)
      })
    } else if (id == '948735056355139614' && content.split(" ").length < 50 && author.id != '964864728109301760') {
      updatePoints("self-intro without bonus", author.id)
      await channel.send(`<@${author.id}> has successfully self introduced!`).then((message) => {
        setTimeout(() => {
          message.delete()
        }, 1000 * 60)
      })
    }
  })
}

module.exports = async (client) => {
  checkSelfIntro(client)
}
