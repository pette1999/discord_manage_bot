const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const reqBool = {
  type: Boolean,
  required: true,
}

const soialMediaPostSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    postLink: reqString,
    approved: reqBool,
    hasRewarded: reqBool,
    hasBonus: reqBool,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('post', soialMediaPostSchema)