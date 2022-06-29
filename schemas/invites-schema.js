const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const reqArray = {
  type: [String],
  required: true,
}

const invitesSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    invites: reqString,
    invite_People: reqArray,
  }
)

module.exports = mongoose.model('invites', invitesSchema)