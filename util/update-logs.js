const pointsRecord = require('@schemas/points-log-schema')

const updateLogs = async (id, feature) => {
  const query = { userId: id }
  const updateDocument = {
    $push: { "record.$[orderItem].record": feature }
  }
  const options = {
    arrayFilters: [{
      "orderItem.date": new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(",")[0],
    }]
  }
  await pointsRecord.updateOne(query, updateDocument, options)
}

module.exports = async (id, feature) => {
  updateLogs(id, feature)
}