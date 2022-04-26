const mongoose = require('mongoose')
const reactDom = require('react-dom')

const reqString = {
  type: String,
  required: true,
}

const eventTimeframeSchema = mongoose.Schema(
  {
    start: reqString,
    end: reqString,
  }
)

module.exports = mongoose.model('event-timeframe-schema', eventTimeframeSchema)