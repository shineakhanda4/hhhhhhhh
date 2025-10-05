const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'boop',
  description: 'Boop someone on the nose',
  usage: 'boop <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to boop!');
    }
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setDescription(`${message.author} boops ${user}'s nose! 👃`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
