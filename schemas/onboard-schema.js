const mongoose = require('mongoose')

const reqNumber = {
  type: Number,
  required: true,
}

const reqString = {
  type: String,
  required: true,
}

const onboardSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    onboard: reqNumber,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('onboard', onboardSchema)