const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildBanRemove',
  async execute(ban, client) {
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = ban.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🔓 User Unbanned')
        .addFields(
          { name: 'User', value: `${ban.user.tag}`, inline: true },
          { name: 'ID', value: ban.user.id, inline: true }
        )
        .setThumbnail(ban.user.displayAvatarURL())
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging unban:', error);
    }
  },
};
