const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const statbotMessageSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    messageCount: reqString,
    messageRank: reqString,
  }
)

module.exports = mongoose.model('messageCount', statbotMessageSchema)