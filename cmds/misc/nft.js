const { MessageEmbed } = require('discord.js')
const { RichEmbed } = require('discord.js');
const Commando = require('discord.js-commando')

module.exports = class nftCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'nft',
      group: 'misc',
      memberName: 'nft',
      description: 'Displays user NFT',
    })
  }

  async run(message) {
    const { guild, member, channel } = message
    const { id } = member
    const user = member.user

    message.channel.createWebhook('Webhook Name', message.author.displayAvatarURL)
      .then(w => w.send({
        embeds: [
          new MessageEmbed().setImage('https://i.imgur.com/AfFp7pu.png', size = 500),
          new MessageEmbed().setImage('https://i.imgur.com/AfFp7pu.png', size = 500),
        ]
      }));
  }
}