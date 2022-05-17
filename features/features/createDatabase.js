const pointsRecord = require('@schemas/points-log-schema')
const fs = require('fs')

const createTable = async (client) => {
  const guild = client.guilds.cache.get("948732804999553034")
  if (new Date().getHours()-7==0 && new Date().getMinutes()==0) {
    var people = []
    await guild.members.fetch().then((members) => {
      members.forEach(async (member) => {
        const { user } = member
        const { id, username, discriminator } = user
        const name = `${username}#${discriminator}`

        const pointEvent = {
          userId: id,
          userName: name,
          pointEvent: [],
        }

        people.push(pointEvent)
      })
    })
    // parse the data to json file
    const data = JSON.stringify(people, null, 4)
    fs.writeFileSync('./data/user_points_log.json', data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    })
  } else if(new Date().getHours()-7==23 && new Date().getMinutes()==59) {
    // write json file to the database
    var people_data = []
    fs.readFile("./data/user_points_log.json", 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        for (o of JSON.parse(data)) {
          people_data.push(o)
        }
      }
    })

    const obj = {
      date: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0],
      record: people_data
    }

    await pointsRecord.findOneAndUpdate({ date: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0] }, obj, {
      upsert: true,
    })
  }
  // write JSON string to a file

  // fs.readFile('./data/user_points_log.json', 'utf-8', (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   people = []
  //   for (o of JSON.parse(data)) {
  //     if (o['userId'] == "802286341718147073") {
  //       o['pointEvent'].push('morning')
  //       const obj = {
  //         userId: o['userId'],
  //         userName: o['userName'],
  //         pointEvent: o['pointEvent'],
  //       }
  //       people.push(obj)
  //     } else {
  //       people.push(o)
  //     }
  //   }
  //   console.log(people)
  //   // parse JSON object
  //   const log = JSON.parse(data.toString());
}

const makeTable = async (client) => {
  // every day at 0, we create a new obj in the json file to record that day's points for everyone
  if(new Date().getHours()-7==0 && new Date().getMinutes()==0) {
    const peopleArr = await pointsRecord.find()
    // parse the data to json file
    const data = JSON.stringify(peopleArr, null, 4)
    fs.writeFileSync('./data/user_points_log.json', data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    })
    // peopleArr.forEach(async people => {
    //   const today = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0]
    //   var records = people['record']
    //   records.push({ date: today, record: [] })
    //   await pointsRecord.updateOne({ userId: people['userId'] }, { "$set": { "record": records } })
    // })
    fs.readFile("./data/user_points_log.json", 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var result = []
        for (d of JSON.parse(data)) {
          const today = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0]
          d['record'].push({ date: today, record: [] })
          console.log(d)
          result.push(d)
        }
        fs.writeFileSync("./data/user_points_log.json", JSON.stringify(result, null, 4), 'utf8', err => {
          if (err) throw err
          console.log('File has been saved!')
        })
      }
    })
  } else if (new Date().getHours()-7==23 && new Date().getMinutes()==59) {
    // every day at 23:59, we sync our local json file to our database
    fs.readFile("./data/user_points_log.json", 'utf8', async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        for (d of JSON.parse(data)) {
          console.log(d['record'])
          await pointsRecord.updateOne({ userId: d['userId'] }, { "$set": { "record": d['record'] } })
        }
      }
    })
  }
  setTimeout(() => {
    weeklyScore(client)
  }, 1000 * 60)
  // const guild = client.guilds.cache.get("948732804999553034")
  // await guild.members.fetch().then((members) => {
  //   members.forEach(async (member) => {
  //     const { user } = member
  //     const { id, username, discriminator } = user
  //     const name = `${username}#${discriminator}`

  //     const obj = {
  //       userId: id,
  //       userName: name,
  //       record: [],
  //     }

  //     await pointsRecord.findOneAndUpdate({ userId: id }, obj, {
  //       upsert: true,
  //     })
  //   })
  // })
}

module.exports = async (client) => {
  makeTable(client)
}