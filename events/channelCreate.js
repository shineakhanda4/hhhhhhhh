const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'channelCreate',
  async execute(channel, client) {
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = channel.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('📢 Channel Created')
        .addFields(
          { name: 'Channel', value: `${channel.name}`, inline: true },
          { name: 'Type', value: channel.type.toString(), inline: true },
          { name: 'ID', value: channel.id, inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging channel create:', error);
    }
  },
};
