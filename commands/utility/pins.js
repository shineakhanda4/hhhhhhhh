const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'pins',
  aliases: ['pinned'],
  description: 'View all pinned messages in the channel',
  usage: '',
  async execute(message, args, client) {
    try {
      const pinnedMessages = await message.channel.messages.fetchPinned();

      if (pinnedMessages.size === 0) {
        return message.reply('❌ No pinned messages in this channel!');
      }

      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle(`📌 Pinned Messages (${pinnedMessages.size}/50)`)
        .setDescription(
          pinnedMessages
            .map((msg, i) => `**${pinnedMessages.size - i}.** ${msg.author.tag}: ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}\n[Jump](${msg.url})`)
            .reverse()
            .join('\n\n')
            .substring(0, 4000)
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Failed to fetch pinned messages!');
    }
  },
};
