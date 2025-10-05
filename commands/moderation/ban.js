const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the server',
  usage: '<@user> [reason]',
  permissions: [PermissionsBitField.Flags.BanMembers],
  args: true,
  async execute(message, args, client) {
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Please mention a valid member to ban!');
    }

    if (!member.bannable) {
      return message.reply('❌ I cannot ban this member!');
    }

    if (member.id === message.author.id) {
      return message.reply('❌ You cannot ban yourself!');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await member.send(`You have been banned from **${message.guild.name}** for: ${reason}`).catch(() => {});
      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🔨 Member Banned')
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
      message.reply('❌ Failed to ban the member!');
    }
  },
};
