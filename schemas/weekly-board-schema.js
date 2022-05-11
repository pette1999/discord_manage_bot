const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const weeklyBoardSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    weeklyScore: reqString,
  }
)

module.exports = mongoose.model('weekly_Board', weeklyBoardSchema)