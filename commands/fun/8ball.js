const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8ball a question',
  usage: '<question>',
  args: true,
  async execute(message, args, client) {
    const responses = [
      'Yes, definitely!',
      'It is certain.',
      'Without a doubt.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      'Don\'t count on it.',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🎱 Magic 8Ball')
      .addFields(
        { name: 'Question', value: args.join(' '), inline: false },
        { name: 'Answer', value: response, inline: false }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
