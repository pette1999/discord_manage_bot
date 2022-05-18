const fs = require('fs')

const updatePoints = async (feature, id) => {
  // log the checkin
  fs.readFile("./data/user_points_log.json", 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      var result = []
      for (var d of JSON.parse(data)) {
        const today = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0]
        if (d['userId'] == id) {
          for (var r of d['record']) {
            (r['date'] == today) ? r['record'].push(feature) : console.log()
          }
          result.push(d)
        } else {
          result.push(d)
        }
      }
      fs.writeFileSync("./data/user_points_log.json", JSON.stringify(result, null, 4), 'utf8', err => {
        if (err) throw err
        console.log('File has been saved!')
      })
    }
  })
}

module.exports = async (feature, id) => {
  updatePoints(feature, id)
}