const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Display user avatar',
  usage: '[@user]',
  aliases: ['av', 'pfp'],
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
