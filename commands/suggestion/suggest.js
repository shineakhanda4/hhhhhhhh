const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'suggest',
  description: 'Submit a suggestion',
  usage: '<suggestion>',
  args: true,
  async execute(message, args, client) {
    const suggestion = args.join(' ');

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('💡 New Suggestion')
      .setDescription(suggestion)
      .setFooter({ text: `Suggested by ${message.author.tag}` })
      .addFields(
        { name: 'Status', value: '⏳ Pending', inline: true },
        { name: 'Votes', value: '👍 0 | 👎 0', inline: true }
      )
      .setTimestamp();

    const suggestionMsg = await message.channel.send({ embeds: [embed] });
    
    await suggestionMsg.react('👍');
    await suggestionMsg.react('👎');

    await client.db.addSuggestion(suggestionMsg.id, {
      guildId: message.guild.id,
      userId: message.author.id,
      suggestion,
      status: 'pending',
      channelId: message.channel.id,
    });

    message.delete().catch(() => {});
  },
};
