const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const feedbackSchema = mongoose.Schema (
  {
    userId: reqString,
    userName: reqString,
    feedback: reqString,
    approved: reqString,
    hasRewarded: reqString,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('feedback', feedbackSchema)