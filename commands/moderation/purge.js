const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Delete multiple messages',
  usage: '<amount>',
  aliases: ['clear', 'clean'],
  permissions: [PermissionsBitField.Flags.ManageMessages],
  args: true,
  async execute(message, args, client) {
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('❌ Please provide a number between 1 and 100!');
    }

    try {
      const messages = await message.channel.messages.fetch({ limit: amount + 1 });
      await message.channel.bulkDelete(messages, true);
      
      const reply = await message.channel.send(`✅ Deleted ${amount} messages!`);
      setTimeout(() => reply.delete().catch(() => {}), 5000);
      await client.db.trackEvent(message.guild.id, 'moderationActions');
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to delete messages! Messages older than 14 days cannot be bulk deleted.');
    }
  },
};
