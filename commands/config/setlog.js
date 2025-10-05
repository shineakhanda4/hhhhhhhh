const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'setlog',
  description: 'Set the logging channel',
  usage: '<#channel>',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  args: true,
  async execute(message, args, client) {
    const channel = message.mentions.channels.first();

    if (!channel) {
      return message.reply('❌ Please mention a valid channel!');
    }

    client.config.logging.logChannel = channel.id;
    message.reply(`✅ Logging channel set to ${channel}`);
  },
};
