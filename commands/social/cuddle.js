const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cuddle',
  description: 'Cuddle with someone',
  usage: 'cuddle <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to cuddle with!');
    }
    
    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setDescription(`${message.author} cuddles with ${user}! 🤗💕`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
