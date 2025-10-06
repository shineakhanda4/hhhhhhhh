const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'addadmin',
  description: 'Add a bot admin who can manage economy',
  usage: '<@user|user_id|username>',
  permissions: [PermissionsBitField.Flags.Administrator],
  async execute(message, args, client) {
    const target = message.mentions.users.first() || 
                   await client.users.fetch(args[0]).catch(() => null) ||
                   message.guild.members.cache.find(m => m.user.username === args.join(' '))?.user;

    if (!target) {
      return message.reply('❌ User not found! Use: `addadmin @user`, `addadmin user_id`, or `addadmin username`');
    }

    if (client.config.adminIds.includes(target.id)) {
      return message.reply(`❌ ${target.username} is already a bot admin!`);
    }

    client.config.adminIds.push(target.id);

    await client.db.addBotAdmin(target.id);

    message.reply(`✅ ${target.username} has been added as a bot admin! They can now manage economy.`);
  },
};
