const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'removeadmin',
  description: 'Remove a bot admin',
  usage: '<@user|user_id>',
  permissions: [PermissionsBitField.Flags.Administrator],
  async execute(message, args, client) {
    const target = message.mentions.users.first() || 
                   await client.users.fetch(args[0]).catch(() => null);

    if (!target) {
      return message.reply('❌ User not found!');
    }

    const index = client.config.adminIds.indexOf(target.id);
    if (index === -1) {
      return message.reply(`❌ ${target.username} is not a bot admin!`);
    }

    client.config.adminIds.splice(index, 1);

    await client.db.removeBotAdmin(target.id);

    message.reply(`✅ ${target.username} has been removed as a bot admin!`);
  },
};
