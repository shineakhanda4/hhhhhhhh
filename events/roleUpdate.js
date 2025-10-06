const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'roleUpdate',
  async execute(oldRole, newRole, client) {
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = newRole.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const changes = [];

      if (oldRole.name !== newRole.name) {
        changes.push(`**Name:** ${oldRole.name} → ${newRole.name}`);
      }

      if (oldRole.hexColor !== newRole.hexColor) {
        changes.push(`**Color:** ${oldRole.hexColor} → ${newRole.hexColor}`);
      }

      if (oldRole.hoist !== newRole.hoist) {
        changes.push(`**Hoisted:** ${oldRole.hoist ? 'Yes' : 'No'} → ${newRole.hoist ? 'Yes' : 'No'}`);
      }

      if (oldRole.mentionable !== newRole.mentionable) {
        changes.push(`**Mentionable:** ${oldRole.mentionable ? 'Yes' : 'No'} → ${newRole.mentionable ? 'Yes' : 'No'}`);
      }

      if (changes.length > 0) {
        const embed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('🎭 Role Updated')
          .addFields(
            { name: 'Role', value: `${newRole.name}`, inline: true },
            { name: 'Changes', value: changes.join('\n'), inline: false }
          )
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error logging role update:', error);
    }
  },
};
