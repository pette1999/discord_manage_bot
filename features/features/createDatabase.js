const pointsRecord = require('@schemas/points-log-schema')
const fs = require('fs')

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
  if (new Date().getHours() - 7 == 0 && new Date().getMinutes() == 0) {
    fs.readFile("./data/user_points_log.json", 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var result = []
        for (d of JSON.parse(data)) {
          const today = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0]
          d['record'].push({ date: today, record: [] })
          result.push(d)
        }
        fs.writeFileSync("./data/user_points_log.json", JSON.stringify(result, null, 4), 'utf8', err => {
          if (err) throw err
          console.log('File has been saved!')
        })
      }
    })
  }
  setTimeout(() => {
    makeTable(client)
  }, 1000 * 60)
}

const makeTable = async (client) => {
  // we sync our local json file to our database
  fs.readFile("./data/user_points_log.json", 'utf8', async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      for (var d of JSON.parse(data)) {
        // console.log(d['record'])
        await pointsRecord.updateOne({ userId: d['userId'] }, { "$set": { "record": d['record'] } })
      }
    }
  })

  // const peopleArr = await pointsRecord.find()
  // // parse the data to json file
  // const data = JSON.stringify(peopleArr, null, 4)
  // fs.writeFileSync('./data/user_points_log.json', data, (err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log("JSON data is saved.");
  // })
  // peopleArr.forEach(async people => {
  //   const today = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0]
  //   var records = people['record']
  //   records.push({ date: today, record: [] })
  //   await pointsRecord.updateOne({ userId: people['userId'] }, { "$set": { "record": records } })
  // })
  setTimeout(() => {
    makeTable(client)
  }, 1000 * 60)
}

module.exports = async (client) => {
  syncLogTable(client)
  updateTimeLog(client)
  makeTable(client)
}