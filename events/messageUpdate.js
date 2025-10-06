const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage, client) {
    if (newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = newMessage.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('✏️ Message Edited')
        .addFields(
          { name: 'Author', value: `${newMessage.author.tag}`, inline: true },
          { name: 'Channel', value: `${newMessage.channel}`, inline: true },
          { name: 'Old Content', value: oldMessage.content ? oldMessage.content.substring(0, 1024) : 'No content', inline: false },
          { name: 'New Content', value: newMessage.content ? newMessage.content.substring(0, 1024) : 'No content', inline: false },
          { name: 'Jump to Message', value: `[Click here](${newMessage.url})`, inline: false }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging message edit:', error);
    }
  },
};
