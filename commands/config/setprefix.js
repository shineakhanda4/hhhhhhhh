const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'setprefix',
  description: 'Change the bot prefix',
  usage: '<new_prefix>',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  args: true,
  async execute(message, args, client) {
    const newPrefix = args[0];

    if (newPrefix.length > 5) {
      return message.reply('❌ Prefix must be 5 characters or less!');
    }

    client.config.prefix = newPrefix;
    message.reply(`✅ Prefix changed to \`${newPrefix}\``);
  },
};
