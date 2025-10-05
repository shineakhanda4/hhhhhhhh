const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'suggestion',
  description: 'Manage suggestions',
  usage: '<approve|deny> <message_id> [reason]',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  args: true,
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();
    const messageId = args[1];

    if (!['approve', 'deny'].includes(action)) {
      return message.reply('❌ Usage: `suggestion <approve|deny> <message_id> [reason]`');
    }

    const suggestion = client.db.getSuggestion(messageId);
    
    if (!suggestion) {
      return message.reply('❌ Suggestion not found!');
    }

    try {
      const channel = await message.client.channels.fetch(suggestion.channelId);
      const suggestionMsg = await channel.messages.fetch(messageId);
      
      const oldEmbed = suggestionMsg.embeds[0];
      const reason = args.slice(2).join(' ') || 'No reason provided';

      const newEmbed = EmbedBuilder.from(oldEmbed)
        .setColor(action === 'approve' ? '#00FF00' : '#FF0000')
        .spliceFields(0, 1, { name: 'Status', value: action === 'approve' ? '✅ Approved' : '❌ Denied', inline: true })
        .addFields({ name: 'Review', value: `By ${message.author.tag}: ${reason}` });

      await suggestionMsg.edit({ embeds: [newEmbed] });
      client.db.updateSuggestion(messageId, action === 'approve' ? 'approved' : 'denied');

      message.reply(`✅ Suggestion ${action}ed!`);
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to update suggestion!');
    }
  },
};
