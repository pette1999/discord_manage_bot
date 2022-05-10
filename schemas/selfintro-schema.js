const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const selfIntroSchema = mongoose.Schema(
  {
    user_Id: reqString,
    user_Name: reqString,
    has_Introduced: reqString,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('has_self_intro', selfIntroSchema)