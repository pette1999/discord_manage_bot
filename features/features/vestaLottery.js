const { MessageEmbed } = require('discord.js')
const {rando, randoSequence} = require('@nastyox/rando.js');

const lotteryNotice = async (client) => {
  const guild = client.guilds.cache.get("948732804999553034")
  const channel = guild.channels.cache.get("981544158235885628")
  var members = []
  var message = ""
  // if(new Date().getHours() == 20 && new Date().getMinutes() >= 1 && new Date().getMinutes() < 5) {
  //   channel && channel.members.forEach((member) => {
  //     const { user, _roles } = member
  //     const { id, username, discriminator } = user
  //     const name = `${username}#${discriminator}`
  //     _roles.includes("981526760619405322") && members.push({ id, name })
  //   })

  //   for(var i=0; i<members.length; ++i) {
  //     message += `<@${members[i].id}>, `
  //   }
  //   var timeLeft = parseFloat((1654142700000 - Date.now())/1000/60).toFixed(2)
  //   var description = `抽奖入口已关闭，**${timeLeft}分钟** 后公布获奖者名单!`
  //   const embed = new MessageEmbed()
  //     .setColor('#FFD42B')
  //     .setTitle('Vesta抽奖')
  //     .setDescription(description)
  //     .setThumbnail('https://img.freepik.com/free-vector/glowing-neon-sign-with-award-cup-rectangle-frame-dark-wall-background-winner-cup-honorary-trop_104045-2063.jpg?w=2000')
  //     .addFields({
  //         name: '参与者',
  //         value: message
  //       })
  //     .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
  //     .setTimestamp()
  //   channel.send(embed).then((message) => {
  //     setTimeout(() => {
  //       message.delete()
  //     }, 1000 * 59)
  //   })
  // }

  channel && channel.members.forEach((member) => {
      const { user, _roles } = member
      const { id, username, discriminator } = user
      const name = `${username}#${discriminator}`
      _roles.includes("981526760619405322") && members.push({ id, name })
    })

    for(var i=0; i<members.length; ++i) {
      message += `<@${members[i].id}>, `
    }
    var timeLeft = parseFloat((1654142700000 - Date.now())/1000/60).toFixed(2)
    var description = `抽奖入口已关闭，**${2}分钟** 后公布获奖者名单!`
    const embed = new MessageEmbed()
      .setColor('#FFD42B')
      .setTitle('Vesta抽奖')
      .setDescription(description)
      .setThumbnail('https://img.freepik.com/free-vector/glowing-neon-sign-with-award-cup-rectangle-frame-dark-wall-background-winner-cup-honorary-trop_104045-2063.jpg?w=2000')
      .addFields({
          name: '参与者',
          value: message
        })
      .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
      .setTimestamp()
    channel.send(embed).then((message) => {
      setTimeout(() => {
        message.delete()
      }, 1000 * 59)
    })
  setTimeout(() => {
    openLottery(client)
  }, 1000 * 60)
}

const openLottery = async (client) => {
  const guild = client.guilds.cache.get("948732804999553034")
  const channel = guild.channels.cache.get("981544158235885628")
  var members = []
  var winnerMembers = []
  // if(new Date().getHours() == 20 && new Date().getMinutes() == 5) {
  //   channel && channel.members.forEach((member) => {
  //     const { user, _roles } = member
  //     const { id, username, discriminator } = user
  //     const name = `${username}#${discriminator}`
  //     _roles.includes("981526760619405322") && members.push({ id, name })
  //   })
  //   var winner = randoSequence(0, members.length - 1)
  //   // generate the four random number for the lottery
  //   for(var i=0; i<4; ++i) {
  //     winnerMembers.push(members[winner[i]])
  //   }
  //   console.log(winner)
  //   var winnerMessage1 = `1. <@${winnerMembers[0].id}>\n2. <@${winnerMembers[1].id}>\n3. <@${winnerMembers[2].id}>\n>`
  //   var winnerMessage2 = `1. <@${winnerMembers[3].id}>`
  //   const embed = new MessageEmbed()
  //     .setColor('#FFD42B')
  //     .setTitle('Vesta抽奖')
  //     .setDescription("恭喜四位小伙伴获得本场抽奖福利！Thanks all for a wonderful event, Good Night!")
  //     .setThumbnail('https://img.freepik.com/free-vector/neon-icon-lottery-drum_1262-15647.jpg?t=st=1654090148~exp=1654090748~hmac=5d3eb71460c480d6e1895e08b683eb08e09374eb31defe311c5518f024d5afec&w=2000')
  //     .addFields({
  //       name: '获奖名单',
  //       value: `\u200B`
  //     }, {
  //       name: 'Vesta眼罩',
  //       value: winnerMessage1
  //     }, {
  //       name: 'Vesta竹纤维被套',
  //       value: winnerMessage2
  //     })
  //     .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
  //     .setTimestamp()

  //   channel.send(embed)
  // }
  channel && channel.members.forEach((member) => {
    const { user, _roles } = member
    const { id, username, discriminator } = user
    const name = `${username}#${discriminator}`
    _roles.includes("981526760619405322") && members.push({ id, name })
  })
  var winner = randoSequence(0, members.length - 1)
  // generate the four random number for the lottery
  for(var i=0; i<4; ++i) {
    winnerMembers.push(members[winner[i]])
  }
  console.log(winner)
  var winnerMessage1 = `1. <@${winnerMembers[0].id}>\n2. <@${winnerMembers[1].id}>\n3. <@${winnerMembers[2].id}>\n>`
  var winnerMessage2 = `1. <@${winnerMembers[3].id}>`
  const embed = new MessageEmbed()
    .setColor('#FFD42B')
    .setTitle('Vesta抽奖')
    .setDescription("恭喜四位小伙伴获得本场抽奖福利！Thanks all for a wonderful event, Good Night!")
    .setThumbnail('https://img.freepik.com/free-vector/neon-icon-lottery-drum_1262-15647.jpg?t=st=1654090148~exp=1654090748~hmac=5d3eb71460c480d6e1895e08b683eb08e09374eb31defe311c5518f024d5afec&w=2000')
    .addFields({
      name: '获奖名单',
      value: `\u200B`
    }, {
      name: 'Vesta眼罩',
      value: winnerMessage1
    }, {
      name: 'Vesta竹纤维被套',
      value: winnerMessage2
    })
    .setFooter("Beta Fellowship", "https://i.postimg.cc/xdQCDd0D/beta-logo-wt.png")
    .setTimestamp()

  channel.send(embed).then((message) => {
    setTimeout(() => {
      message.delete()
    }, 1000 * 59)
  })
  setTimeout(() => {
    openLottery(client)
  }, 1000 * 60)
}

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
  // vesta(client)
  // openLottery(client)
  // lotteryNotice(client)
}