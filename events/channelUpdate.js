const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'channelUpdate',
  async execute(oldChannel, newChannel, client) {
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = newChannel.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const changes = [];

      if (oldChannel.name !== newChannel.name) {
        changes.push(`**Name:** ${oldChannel.name} → ${newChannel.name}`);
      }

      if (oldChannel.topic !== newChannel.topic) {
        changes.push(`**Topic:** ${oldChannel.topic || 'None'} → ${newChannel.topic || 'None'}`);
      }

      if (oldChannel.nsfw !== newChannel.nsfw) {
        changes.push(`**NSFW:** ${oldChannel.nsfw ? 'Yes' : 'No'} → ${newChannel.nsfw ? 'Yes' : 'No'}`);
      }

      if (changes.length > 0) {
        const embed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('📝 Channel Updated')
          .addFields(
            { name: 'Channel', value: `${newChannel.name}`, inline: true },
            { name: 'Changes', value: changes.join('\n'), inline: false }
          )
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error logging channel update:', error);
    }
  },
};
