const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const statbotVoiceSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    voiceCount: reqString,
    voiceRank: reqString,
  }
)

module.exports = mongoose.model('voiceCount', statbotVoiceSchema)