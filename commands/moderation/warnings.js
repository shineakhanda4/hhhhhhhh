const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'warnings',
  description: 'View warnings for a member',
  usage: '<@user>',
  aliases: ['warns'],
  args: true,
  async execute(message, args, client) {
    const member = message.mentions.members.first() || message.member;
    const warnings = await client.db.getWarnings(message.guild.id, member.id);

    if (warnings.length === 0) {
      return message.reply('✅ This member has no warnings!');
    }

    const embed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle(`⚠️ Warnings for ${member.user.tag}`)
      .setDescription(warnings.map((w, i) => 
        `**${i + 1}.** ${w.reason}\n*By ${w.moderator} - <t:${Math.floor(w.timestamp / 1000)}:R>*`
      ).join('\n\n'))
      .setFooter({ text: `Total: ${warnings.length} warnings` });

    message.reply({ embeds: [embed] });
  },
};
