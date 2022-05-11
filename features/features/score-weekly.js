const weeklyBoard = require('@schemas/weekly-board-schema')
const weeklyRecordScore = require('@schemas/weekly-score-record-schema')
const userinfoSchema = require('@schemas/userinfo-schema')

const weeklyScore = async (client) => {
  if (new Date().getDay() == 1 && new Date().getHours() == 0 && new Date().getMinutes() == 0) {
    // every Monday at 0:00AM
    // 1. we do clean up the weekly boards score
    // 2. store the total score to the weekly-record_scores database
    

  }
  const guild = client.guilds.cache.get("948732804999553034")
  var user_score = 0

  await guild.members.fetch().then((members) => {
    members.forEach(async (member) => {
      const { user } = member
      const { id, username, discriminator } = user
      const name = `${username}#${discriminator}`
      const userArr = await userinfoSchema.findOne({ user_Id: id })
      userArr ? user_score = parseFloat(userArr['user_Points']) : user_score = 0

      const obj = {
        userId: id,
        userName: name,
        record: [{date: new Date(), score: String(user_score)}],
      }

      await weeklyRecordScore.findOneAndUpdate({ userId: id }, obj, {
        upsert: true,
      })
    })
  })
  setTimeout(() => {
    weeklyScore(client)
  }, 1000 * 60)
}

module.exports = async (client) => {
  weeklyScore(client)
}