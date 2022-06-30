const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const eventHostSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    eventDate: reqString,
    approved: reqString,
    hasRewarded: reqString,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('event-hosting', eventHostSchema)