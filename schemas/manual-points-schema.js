const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const manualPointsSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    reason: reqString,
    points: reqString,
  },
  {
    timestamps: true,
  }
)