const pointsRecord = require('@schemas/points-log-schema')

const syncLogTable = async (client) => {
  const guild = client.guilds.cache.get("948732804999553034")
  // sync the members to the database every 10 minutes
  await guild.members.fetch().then((members) => {
    members.forEach(async (member) => {
      const { user } = member
      const { id, username, discriminator } = user
      const name = `${username}#${discriminator}`
      pointsRecordArr = await pointsRecord.findOne( {userId:id} )
      if (!(pointsRecordArr)) {
        console.log(`can't find username: ${name}`)
        const obj = {
          userId: id,
          userName: name,
          record: [{ date: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0], record: [] }],
        }
        // store the total score to the weekly-record_scores database
        await pointsRecord.findOneAndUpdate({ userId: id }, obj, {
          upsert: true,
        })
      }
    })
  })
  setTimeout(() => {
    syncLogTable(client)
  }, 1000 * 60 * 10)
}

const updateTimeLog = async (client) => {
  const pointsLogArr = await pointsRecord.find()
  if (new Date().getHours() - 7 == 0 && new Date().getMinutes() == 0) {
    pointsLogArr.forEach(async (log) => {
      await pointsRecord.updateOne({ userId: log['userId'] }, { $push: { "record": new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0] }})
    })
  }
  setTimeout(() => {
    updateTimeLog(client)
  }, 1000 * 60)
}

module.exports = async (client) => {
  syncLogTable(client)
  updateTimeLog(client)
}