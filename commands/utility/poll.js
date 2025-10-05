const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'poll',
  description: 'Create a poll',
  usage: '<question>',
  args: true,
  async execute(message, args, client) {
    const question = args.join(' ');

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📊 Poll')
      .setDescription(question)
      .setFooter({ text: `Poll by ${message.author.tag}` })
      .setTimestamp();

    const pollMessage = await message.channel.send({ embeds: [embed] });
    
    await pollMessage.react('👍');
    await pollMessage.react('👎');
    await pollMessage.react('🤷');

    message.delete().catch(() => {});
  },
};
