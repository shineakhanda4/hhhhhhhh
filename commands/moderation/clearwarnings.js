const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'clearwarnings',
  description: 'Clear all warnings for a member',
  usage: '<@user>',
  aliases: ['clearwarns'],
  permissions: [PermissionsBitField.Flags.ModerateMembers],
  args: true,
  async execute(message, args, client) {
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('❌ Please mention a valid member!');
    }

    client.db.clearWarnings(message.guild.id, member.id);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Warnings Cleared')
      .setDescription(`All warnings have been cleared for ${member.user.tag}`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
