const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Warn a member',
  usage: '<@user> <reason>',
  permissions: [PermissionsBitField.Flags.ModerateMembers],
  args: true,
  async execute(message, args, client) {
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Please mention a valid member to warn!');
    }

    const reason = args.slice(1).join(' ');
    if (!reason) {
      return message.reply('❌ Please provide a reason for the warning!');
    }

    client.db.addWarning(message.guild.id, member.id, reason, message.author.tag);

    const warnings = client.db.getWarnings(message.guild.id, member.id);

    const embed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle('⚠️ Member Warned')
      .addFields(
        { name: 'User', value: `${member.user.tag}`, inline: true },
        { name: 'Moderator', value: `${message.author.tag}`, inline: true },
        { name: 'Total Warnings', value: warnings.length.toString(), inline: true },
        { name: 'Reason', value: reason, inline: false }
      )
      .setTimestamp();

    await member.send(`You have been warned in **${message.guild.name}** for: ${reason}`).catch(() => {});
    message.reply({ embeds: [embed] });
    client.db.trackEvent(message.guild.id, 'moderationActions');
  },
};
