const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'poke',
  description: 'Poke someone',
  usage: 'poke <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to poke!');
    }
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setDescription(`${message.author} pokes ${user}! 👉`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
