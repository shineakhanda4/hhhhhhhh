const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    if (message.author?.bot) return;
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = message.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('🗑️ Message Deleted')
        .addFields(
          { name: 'Author', value: message.author ? `${message.author.tag}` : 'Unknown', inline: true },
          { name: 'Channel', value: `${message.channel}`, inline: true },
          { name: 'Content', value: message.content ? message.content.substring(0, 1024) : 'No content', inline: false }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging message delete:', error);
    }
  },
};
