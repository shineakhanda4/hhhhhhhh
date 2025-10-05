module.exports = {
  name: 'roll',
  description: 'Roll a dice',
  usage: '[sides]',
  aliases: ['dice'],
  async execute(message, args, client) {
    const sides = parseInt(args[0]) || 6;

    if (sides < 2 || sides > 100) {
      return message.reply('❌ Please provide a number between 2 and 100!');
    }

    const result = Math.floor(Math.random() * sides) + 1;
    message.reply(`🎲 You rolled a **${result}** (1-${sides})`);
  },
};
