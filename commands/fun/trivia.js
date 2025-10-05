const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'trivia',
  description: 'Answer a trivia question',
  async execute(message, args, client) {
    const questions = [
      { question: 'What is the capital of France?', answer: 'Paris' },
      { question: 'How many continents are there?', answer: '7' },
      { question: 'What is 2 + 2?', answer: '4' },
      { question: 'What color is the sky?', answer: 'Blue' },
      { question: 'Who invented Discord?', answer: 'Jason Citron' },
    ];

    const trivia = questions[Math.floor(Math.random() * questions.length)];

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🧠 Trivia Time!')
      .setDescription(trivia.question)
      .setFooter({ text: 'You have 15 seconds to answer!' })
      .setTimestamp();

    const triviaMsg = await message.reply({ embeds: [embed] });

    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', m => {
      if (m.content.toLowerCase() === trivia.answer.toLowerCase()) {
        m.reply('✅ Correct! Great job!');
      } else {
        m.reply(`❌ Wrong! The correct answer was: **${trivia.answer}**`);
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        triviaMsg.reply(`⏱️ Time's up! The answer was: **${trivia.answer}**`);
      }
    });
  },
};
