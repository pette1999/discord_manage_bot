const { MessageEmbed } = require('discord.js')

const vesta = async (client) => {
  const guild = client.guilds.cache.get("948732804999553034")
  const channel = guild.channels.cache.get("981544158235885628")
  var members = []
  var timeLeft = parseFloat((1654142400000 - Date.now())/1000/60).toFixed(2)
  var message = `欢迎大家来参加今晚由Beta Fellowship组织的Vesta线上分享活动，活动抽奖倒计时 **${timeLeft}** 分钟！`

  // get people in the Vesta Channel
  channel && channel.members.forEach((member) => {
    const { user, _roles } = member
    const { id, username, discriminator } = user
    const name = `${username}#${discriminator}`
    _roles.includes("981526760619405322") && members.push({ id, name })
  })
  console.log(members)

  const embed = new MessageEmbed()
    .setColor('#FFD42B')
    .setTitle('Vesta抽奖')
    .setDescription(message)
    .setThumbnail('https://img.freepik.com/free-vector/neon-icon-lottery-drum_1262-15647.jpg?t=st=1654090148~exp=1654090748~hmac=5d3eb71460c480d6e1895e08b683eb08e09374eb31defe311c5518f024d5afec&w=2000')
    .addFields({
        name: '当前参加人数',
        value: `**${members.length}** 人`
      })
    .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
    .setTimestamp()

  channel.send(embed).then((message) => {
    setTimeout(() => {
      message.delete()
    }, 1000 * 59)
  })
  setTimeout(() => {
    vesta(client)
  }, 1000 * 60)
}

module.exports = async (client) => {
  vesta(client)
}