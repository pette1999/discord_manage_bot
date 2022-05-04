const mongoose = require('mongoose')
const { mongoPath } = require('@root/config.json')

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  return mongoose
}
