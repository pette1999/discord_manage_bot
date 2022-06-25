const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const speakerInviteSchema = mongoose.Schema (
  {
    userId: reqString,
    userName: reqString,
    speakerRole: reqString,
    speakerName : reqString,
    approved: reqString,
    hasRewarded: reqString
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('speaker_invite', speakerInviteSchema)