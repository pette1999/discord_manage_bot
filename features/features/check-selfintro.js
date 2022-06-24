const selfintoSchema = require('@schemas/selfintro-schema')
const updateLogs = require('../../util/update-logs')

const checkSelfIntro = async (client) => {
  const guild = client.guilds.cache.get("948732804999553034")
  var selfIntro_ids = []

  client.on("message", async msg => {
    const { channel, content, author } = msg
    const { id } = channel
    if (id == '948735056355139614' && content.split(" ").length >= 25 && author.id != '964864728109301760') {
      await selfintoSchema.findOneAndUpdate({ user_Id: author.id }, { "$set": { "has_Introduced": "1" } }, { upsert: true })
      // log the checkin directly
      updateLogs(author.id, "self-intro with bonus")
      console.log(`${author.id} has successfully self introduced and won a bonus!`)
      await channel.send(`<@${author.id}> has successfully self introduced and won a bonus!`).then((message) => {
        setTimeout(() => {
          message.delete()
        }, 1000 * 60)
      })
    } else if (id == '948735056355139614' && content.split(" ").length < 50 && author.id != '964864728109301760') {
      // log the checkin directly
      updateLogs(author.id, "self-intro without bonus")
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