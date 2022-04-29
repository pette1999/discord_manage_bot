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

const reqNumber = {
  type: Number,
  required: true,
}

const socialMediaPostSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    postLink: reqString,
    approved: reqBool,
    hasRewarded: reqBool,
    hasBonus: reqBool,
    like: reqNumber,
    comment: reqNumber,
    share: reqNumber,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('post', socialMediaPostSchema)