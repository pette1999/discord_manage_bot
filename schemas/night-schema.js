const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const reqNumber = {
  type: Number,
  required: true,
}

const nightSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    nightCount: reqNumber,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('night', nightSchema)