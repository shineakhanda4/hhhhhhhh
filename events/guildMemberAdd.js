const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    await client.db.trackEvent(member.guild.id, 'membersJoined');

    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = member.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Member Joined')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Member Count', value: member.guild.memberCount.toString(), inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging member join:', error);
    }
  },
};
