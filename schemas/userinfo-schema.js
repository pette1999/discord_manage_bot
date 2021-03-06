const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const reqNumber = {
  type: Number,
  required: true,
}

const userinfoSchema = mongoose.Schema(
  {
    user_Id: reqString,
    user_Name: reqString,
    user_Roles: reqString,
    user_Invites: reqString,
    user_Attendances: reqString,
    user_Messages: reqString,
    user_Voices: reqString,
    user_Posts: reqNumber,
    user_Points: reqNumber,
  }
)

module.exports = mongoose.model('users', userinfoSchema)