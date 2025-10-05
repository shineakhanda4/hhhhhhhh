const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    await client.db.trackEvent(member.guild.id, 'membersLeft');

    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = member.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Member Left')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
          { name: 'Member Count', value: member.guild.memberCount.toString(), inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging member leave:', error);
    }
  },
};
