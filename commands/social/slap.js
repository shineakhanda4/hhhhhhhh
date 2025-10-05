const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'slap',
  description: 'Slap someone',
  usage: 'slap <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to slap!');
    }
    
    const embed = new EmbedBuilder()
      .setColor('#e74c3c')
      .setDescription(`${message.author} slaps ${user}! 👋💥`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
