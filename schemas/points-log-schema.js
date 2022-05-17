const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const reqArray = {
  type: [{ date: reqString, record: [String] }],
  required: true,
}

const pointsLogSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    record: reqArray,
  }
)

module.exports = mongoose.model('points_log', pointsLogSchema)