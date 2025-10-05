const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'reactionrole',
  description: 'Set up reaction roles',
  usage: '<message_id> <emoji> <@role>',
  aliases: ['rr'],
  permissions: [PermissionsBitField.Flags.ManageRoles],
  args: true,
  async execute(message, args, client) {
    const messageId = args[0];
    const emoji = args[1];
    const role = message.mentions.roles.first();

    if (!messageId || !emoji || !role) {
      return message.reply('❌ Usage: `reactionrole <message_id> <emoji> <@role>`');
    }

    try {
      const targetMessage = await message.channel.messages.fetch(messageId);
      await targetMessage.react(emoji);

      client.db.addReactionRole(messageId, emoji, role.id);
      message.reply(`✅ Reaction role set! Reacting with ${emoji} will give ${role}`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to set reaction role! Make sure the message ID and emoji are valid.');
    }
  },
};
