const checkFilePath = async (client) => {
  client.on("message", async msg => {
    console.log("MESSAGE", msg)
  })
}

module.exports = async (client) => {
  //checkFilePath(client)
  console.log()
}