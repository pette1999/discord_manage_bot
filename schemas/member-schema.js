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

const reqArray = {
  type: [String],
  required: true,
}

const memberScoreSchema = mongoose.Schema(
  {
    user_Id: reqString,
    user_Name: reqString,
    user_Roles: reqNumber,
    user_Score: reqNumber,
    invites_Friends: reqNumber,
    invites_Speaker: reqNumber,
    user_Attendance: reqNumber,
    user_Message_Count: reqNumber,
    user_Voice: reqNumber,
    post_Written: reqArray,
    post_Written_Count: reqNumber,
    post_LearningDocShared: reqArray,
    post_LearningDocShared_Count: reqNumber,
    post_Video: reqArray,
    post_Video_Count: reqNumber,
    post_Bonus: reqArray,
    post_Bonus_Count: reqNumber,
    user_Mentees: reqArray,
    user_Mentees_Count: reqNumber,
    user_EventSpeaking: reqArray,
    user_EventSpeaking_Count: reqNumber,
    user_EventHost: reqArray,
    user_EventHost_Count: reqNumber,
    user_DollarPurchase: reqNumber,
    user_DollarInvestment: reqNumber,
    user_DollarReferredPuchase: reqNumber,
    user_NFT: reqArray,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('member', memberScoreSchema)