const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const reqNumber = {
  type: Number,
  required: true,
}

const morningSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    morningCount: reqNumber,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('morning', morningSchema)