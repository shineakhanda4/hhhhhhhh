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

      await client.db.addTrigger(message.guild.id, trigger, response);
      message.reply(`✅ Trigger \`${trigger}\` created!`);
      
    } else if (action === 'delete') {
      const trigger = args[1]?.toLowerCase();
      
      if (!trigger) {
        return message.reply('❌ Usage: `trigger delete <trigger>`');
      }

      await client.db.deleteTrigger(message.guild.id, trigger);
      message.reply(`✅ Trigger \`${trigger}\` deleted!`);
    } else {
      message.reply('❌ Invalid action! Use: create, delete');
    }
  },
};
