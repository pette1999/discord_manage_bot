const { MessageEmbed } = require('discord.js')

const manageReactions = async (client) => {
  client.on("messageReactionAdd", async (reaction_orig, user) => {
    console.log("Interaction: ", user)
  })
}

module.exports = async (client) => {
  manageReactions(client)
}