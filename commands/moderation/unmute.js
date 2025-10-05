const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmute a member',
  usage: '<@user>',
  permissions: [PermissionsBitField.Flags.ModerateMembers],
  args: true,
  async execute(message, args, client) {
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Please mention a valid member to unmute!');
    }

    try {
      await member.timeout(null);
      client.db.removeMute(message.guild.id, member.id);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🔊 Member Unmuted')
        .addFields(
          { name: 'User', value: `${member.user.tag}`, inline: true },
          { name: 'Moderator', value: `${message.author.tag}`, inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
      client.db.trackEvent(message.guild.id, 'moderationActions');
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to unmute the member!');
    }
  },
};
