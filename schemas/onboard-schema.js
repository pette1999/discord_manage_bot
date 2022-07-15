const mongoose = require('mongoose')

const reqArray = {
  type: [String],
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
    onboard: reqArray,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('onboard', onboardSchema)