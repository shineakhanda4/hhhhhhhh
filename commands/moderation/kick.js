const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a member from the server',
  usage: '<@user> [reason]',
  permissions: [PermissionsBitField.Flags.KickMembers],
  args: true,
  async execute(message, args, client) {
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Please mention a valid member to kick!');
    }

    if (!member.kickable) {
      return message.reply('❌ I cannot kick this member!');
    }

    if (member.id === message.author.id) {
      return message.reply('❌ You cannot kick yourself!');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await member.send(`You have been kicked from **${message.guild.name}** for: ${reason}`).catch(() => {});
      await member.kick(reason);

      const embed = new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('👢 Member Kicked')
        .addFields(
          { name: 'User', value: `${member.user.tag}`, inline: true },
          { name: 'Moderator', value: `${message.author.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: false }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
      client.db.trackEvent(message.guild.id, 'moderationActions');
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to kick the member!');
    }
  },
};
