const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Display server information',
  aliases: ['si', 'guildinfo'],
  async execute(message, args, client) {
    const { guild } = message;

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`ℹ️ ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: guild.memberCount.toString(), inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
        { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
