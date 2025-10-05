const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'afk',
  description: 'Set your AFK status',
  usage: '[message]',
  async execute(message, args, client) {
    const afkMessage = args.join(' ') || 'AFK';
    
    client.db.setAFK(message.author.id, afkMessage);

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('💤 AFK Status Set')
      .setDescription(`${message.author} is now AFK: ${afkMessage}`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
