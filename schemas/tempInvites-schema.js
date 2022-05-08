const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const tempInviteSchema = mongoose.Schema(
  {
    user_Id: reqString,
    user_Name: reqString,
    inviter_Id: reqString,
    inviter_userName: reqString,
    joined: reqString,
  }
)

module.exports = mongoose.model('temp_Invite', tempInviteSchema)