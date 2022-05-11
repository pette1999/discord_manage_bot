const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const reqArray = {
  type: [{ date: String, score: String }],
  required: true,
}

const weeklyScoreRecordSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    record: reqArray,
  }
)

module.exports = mongoose.model('weekly_record_score', weeklyScoreRecordSchema)