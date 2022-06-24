const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const reqArray = {
  type: [String],
  required: true,
}

const attendanceSchema = mongoose.Schema(
  {
    userId: reqString,
    userName: reqString,
    attendance: reqArray,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('attendance', attendanceSchema)