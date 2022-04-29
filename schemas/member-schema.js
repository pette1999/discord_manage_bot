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
    userId: reqString,
    userName: reqString,
    numRoles: reqNumber,
    friends_invites: reqNumber,
    speaker_invites: reqNumber,
    attendance: reqNumber,
    message: reqNumber,
    voice: reqNumber,
    score: reqNumber,
    written_post: reqArray,
    written_postCount: reqNumber,
    learningDocs_shared: reqArray,
    learningDocs_sharedCount: reqNumber,
    video_post: reqArray,
    video_postCount: reqNumber,
    bonusPost: reqArray,
    bonusPostCount: reqNumber,
    mentees: reqArray,
    mentees_count: reqNumber,
    event_speaking: reqArray,
    event_speakingCount: reqNumber,
    event_host: reqArray,
    event_hostCount: reqNumber,
    dollarPurchase: reqNumber,
    dollarInvestment: reqNumber,
    dollarReferredPuchase: reqNumber,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('member', memberScoreSchema)