const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'trigger',
  description: 'Auto-response triggers',
  usage: '<create|delete> <trigger> [response]',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!action) {
      return message.reply('❌ Usage: `trigger <create|delete> <trigger> [response]`');
    }

    if (action === 'create') {
      const trigger = args[1]?.toLowerCase();
      const response = args.slice(2).join(' ');
      
      if (!trigger || !response) {
        return message.reply('❌ Usage: `trigger create <trigger> <response>`');
      }

      const key = `${message.guild.id}-${trigger}`;
      client.db.triggers.set(key, { response });
      message.reply(`✅ Trigger \`${trigger}\` created!`);
      
    } else if (action === 'delete') {
      const trigger = args[1]?.toLowerCase();
      
      if (!trigger) {
        return message.reply('❌ Usage: `trigger delete <trigger>`');
      }

      const key = `${message.guild.id}-${trigger}`;
      if (!client.db.triggers.has(key)) {
        return message.reply('❌ Trigger not found!');
      }

      client.db.triggers.delete(key);
      message.reply(`✅ Trigger \`${trigger}\` deleted!`);
    } else {
      message.reply('❌ Invalid action! Use: create, delete');
    }
  },
};
