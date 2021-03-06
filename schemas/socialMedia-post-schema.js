const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const socialMediaPostSchema = mongoose.Schema (
  {
    userId: reqString,
    userName: reqString,
    postLink: reqString,
    approved: reqString,
    hasRewarded: reqString,
    hasBonus: reqString,
    like: reqString,
    comment: reqString,
    share: reqString,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('post', socialMediaPostSchema)