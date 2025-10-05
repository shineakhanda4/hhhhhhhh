const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'thread',
  description: 'Thread management commands',
  usage: '<create|archive|lock|delete> [parameters]',
  permissions: [PermissionsBitField.Flags.ManageThreads],
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!action) {
      return message.reply('❌ Usage: `thread <create|archive|lock|delete>`');
    }

    switch (action) {
      case 'create':
        const threadName = args.slice(1).join(' ');
        if (!threadName) {
          return message.reply('❌ Usage: `thread create <name>`');
        }
        
        try {
          const thread = await message.channel.threads.create({
            name: threadName,
            autoArchiveDuration: 60,
            reason: `Created by ${message.author.tag}`,
          });
          message.reply(`✅ Thread created: ${thread}`);
        } catch (error) {
          message.reply('❌ Failed to create thread!');
        }
        break;

      case 'archive':
        if (!message.channel.isThread()) {
          return message.reply('❌ This command must be used in a thread!');
        }
        
        try {
          await message.channel.setArchived(true);
          message.reply('✅ Thread archived!');
        } catch (error) {
          message.reply('❌ Failed to archive thread!');
        }
        break;

      case 'lock':
        if (!message.channel.isThread()) {
          return message.reply('❌ This command must be used in a thread!');
        }
        
        try {
          await message.channel.setLocked(true);
          message.reply('✅ Thread locked!');
        } catch (error) {
          message.reply('❌ Failed to lock thread!');
        }
        break;

      case 'delete':
        if (!message.channel.isThread()) {
          return message.reply('❌ This command must be used in a thread!');
        }
        
        try {
          await message.channel.send('🗑️ Thread will be deleted in 5 seconds...');
          setTimeout(() => message.channel.delete(), 5000);
        } catch (error) {
          message.reply('❌ Failed to delete thread!');
        }
        break;

      default:
        message.reply('❌ Invalid action! Use: create, archive, lock, delete');
    }
  },
};
