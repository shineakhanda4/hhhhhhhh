const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember, client) {
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = newMember.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      if (oldMember.nickname !== newMember.nickname) {
        const embed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('📝 Nickname Changed')
          .addFields(
            { name: 'User', value: `${newMember.user.tag}`, inline: true },
            { name: 'Old Nickname', value: oldMember.nickname || 'None', inline: true },
            { name: 'New Nickname', value: newMember.nickname || 'None', inline: true }
          )
          .setThumbnail(newMember.user.displayAvatarURL())
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }

      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;

      const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

      if (addedRoles.size > 0) {
        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('➕ Roles Added')
          .addFields(
            { name: 'User', value: `${newMember.user.tag}`, inline: true },
            { name: 'Roles Added', value: addedRoles.map(r => r.name).join(', '), inline: false }
          )
          .setThumbnail(newMember.user.displayAvatarURL())
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }

      if (removedRoles.size > 0) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('➖ Roles Removed')
          .addFields(
            { name: 'User', value: `${newMember.user.tag}`, inline: true },
            { name: 'Roles Removed', value: removedRoles.map(r => r.name).join(', '), inline: false }
          )
          .setThumbnail(newMember.user.displayAvatarURL())
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error logging member update:', error);
    }
  },
};
