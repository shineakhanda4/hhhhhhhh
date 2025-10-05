const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cookie',
  description: 'Give someone a cookie',
  usage: 'cookie <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to give a cookie to!');
    }
    
    const embed = new EmbedBuilder()
      .setColor('#8B4513')
      .setDescription(`${message.author} gave ${user} a cookie! 🍪`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
