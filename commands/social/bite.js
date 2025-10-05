const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'bite',
  description: 'Bite someone',
  usage: 'bite <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to bite!');
    }
    
    const embed = new EmbedBuilder()
      .setColor('#e74c3c')
      .setDescription(`${message.author} bites ${user}! 🦷`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
