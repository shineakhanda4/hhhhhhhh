const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'roleCreate',
  async execute(role, client) {
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = role.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎭 Role Created')
        .addFields(
          { name: 'Role', value: `${role.name}`, inline: true },
          { name: 'Color', value: role.hexColor, inline: true },
          { name: 'ID', value: role.id, inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging role create:', error);
    }
  },
};
