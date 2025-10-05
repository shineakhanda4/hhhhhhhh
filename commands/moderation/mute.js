const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Mute a member (timeout)',
  usage: '<@user> <duration_in_minutes> [reason]',
  permissions: [PermissionsBitField.Flags.ModerateMembers],
  args: true,
  async execute(message, args, client) {
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Please mention a valid member to mute!');
    }

    if (!member.moderatable) {
      return message.reply('❌ I cannot mute this member!');
    }

    const duration = parseInt(args[1]);
    if (isNaN(duration) || duration < 1) {
      return message.reply('❌ Please provide a valid duration in minutes!');
    }

    const reason = args.slice(2).join(' ') || 'No reason provided';
    const durationMs = duration * 60 * 1000;

    try {
      await member.timeout(durationMs, reason);
      client.db.addMute(message.guild.id, member.id, durationMs, reason);

      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('🔇 Member Muted')
        .addFields(
          { name: 'User', value: `${member.user.tag}`, inline: true },
          { name: 'Duration', value: `${duration} minutes`, inline: true },
          { name: 'Moderator', value: `${message.author.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: false }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
      client.db.trackEvent(message.guild.id, 'moderationActions');
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to mute the member!');
    }
  },
};
