const { MessageEmbed } = require("discord.js")

const congrats = (client, guildId, channelId, message) => {
  const guild = client.guilds.cache.get(guildId)
  if(guild){
    const channel = guild.channels.cache.get(channelId)
    if(channel) {
      const embed = new MessageEmbed()
        .setColor('#FFD42B')
        .setTitle('Congrats!')
        .setDescription(message)
        .setThumbnail('https://img.freepik.com/free-vector/megaphone-icon-isolated-orange-background-vector-3d-illustration_294779-257.jpg?w=1060')
        .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
        .setTimestamp()
      
      channel.send(embed)
    }
  }

}

module.exports = async (client, guildId, channelId, message) => {
  congrats(client, guildId, channelId, message)
}