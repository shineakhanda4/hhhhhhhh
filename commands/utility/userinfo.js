const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Display user information',
  usage: '[@user]',
  aliases: ['ui', 'whois'],
  async execute(message, args, client) {
    const member = message.mentions.members.first() || message.member;

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`ℹ️ ${member.user.tag}`)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: member.user.id, inline: true },
        { name: 'Nickname', value: member.nickname || 'None', inline: true },
        { name: 'Bot', value: member.user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member.roles.cache.size.toString(), inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
