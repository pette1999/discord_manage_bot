const tempInviteSchema = require('@schemas/tempInvites-schema')

const manageInvites = async (client) => {
  const tempInviteArr = await tempInviteSchema.find()
  var tempJoined = []
  console.log("Temp invite: ")
  console.log(tempInviteArr)
  if(tempInviteArr) {
    tempInviteArr.forEach(async (temp) => {
      if (!tempJoined.includes(temp['user_Id'])){
        console.log(temp['joined'])
        tempJoined.push(temp['user_Id'])

        const now = new Date()
        const joined = Date.parse(temp['joined'])
        const diffHour = Math.round(Math.abs(now - joined) / (1000 * 60 * 60))
        if(diffHour >= 24){
          // we say that's a formal join, we add invite to the inviter
        }
      } else {
        await tempInviteSchema.deleteOne({ _id: temp['_id']})
      }
    })
  }
  

  setTimeout(() => {
    updateScore(client)
  }, 1000 * 60 * 360)
}

module.exports = async (client) => {
  manageInvites(client)
}