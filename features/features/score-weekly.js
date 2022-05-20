const weeklyBoard = require('@schemas/weekly-board-schema')
const weeklyRecordScore = require('@schemas/weekly-score-record-schema')
const userinfoSchema = require('@schemas/userinfo-schema')

const updateWeeklyPoints = async (client) => {
  const userArr = await userinfoSchema.find()
  if(userArr){
    userArr.forEach(async (user) => {
      // get last recorded score from last week
      var lastweek_score = 0.0
      var current_score = 0.0
      var thisweek_score = 0.0
      const weeklyRecordUser = await weeklyRecordScore.findOne({ userId: user['user_Id'] })
      const userArr = await userinfoSchema.findOne({ user_Id: user['user_Id'] })
      userArr ? current_score = parseFloat(userArr['user_Points']) : current_score = 0.0
      weeklyRecordUser ? lastweek_score = parseFloat(weeklyRecordUser['record'][Object.keys(weeklyRecordUser['record'])[Object.keys(weeklyRecordUser['record']).length - 1]]['score']) : lastweek_score = 0.0
      thisweek_score = parseFloat(current_score - lastweek_score).toFixed(2)
      // update this weekly board score
      await weeklyBoard.updateOne({ userId: user['user_Id'] }, { "$set": { "weeklyScore": String(thisweek_score) } })
    })
  }
  await new Promise(resolve => setTimeout(resolve, 3000))
  setTimeout(() => {
    updateWeeklyPoints(client)
  }, 1000 * 60 * 10)
}

const weeklyScore = async (client) => {
  // var user_score = 0

  // await guild.members.fetch().then((members) => {
  //   members.forEach(async (member) => {
  //     const { user } = member
  //     const { id, username, discriminator } = user
  //     const name = `${username}#${discriminator}`
  //     const userArr = await userinfoSchema.findOne({ user_Id: id })
  //     userArr ? user_score = parseFloat(userArr['user_Points']) : user_score = 0

  //     const obj = {
  //       userId: id,
  //       userName: name,
  //       record: [{ date: new Date(), score: String(user_score) }],
  //     }
  //     // store the total score to the weekly-record_scores database
  //     await weeklyRecordScore.findOneAndUpdate({ userId: id }, obj, {
  //       upsert: true,
  //     })
  //     // clean up the weekly boards score
  //     await weeklyBoard.updateOne({ userId: id }, { "$set": { "weeklyScore": "0" } })
  //   })
  // })
  const guild = client.guilds.cache.get("948732804999553034")
  if (new Date().getDay() == 1 && new Date().getHours() - 7 == 0 && new Date().getMinutes() == 0) {
    // every Monday at 0:00AM
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
          record: [{ date: new Date(), score: String(user_score) }],
        }
        // store the total score to the weekly-record_scores database
        await weeklyRecordScore.findOneAndUpdate({ userId: id }, obj, {
          upsert: true,
        })
        // clean up the weekly boards score
        await weeklyBoard.updateOne({ userId: id }, { "$set": { "weeklyScore": "0" } })
      })
    })
  }
  setTimeout(() => {
    weeklyScore(client)
  }, 1000 * 60)
}

module.exports = async (client) => {
  weeklyScore(client)
  updateWeeklyPoints(client)
}