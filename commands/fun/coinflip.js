module.exports = {
  name: 'coinflip',
  description: 'Flip a coin',
  aliases: ['flip', 'coin'],
  async execute(message, args, client) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    message.reply(`🪙 The coin landed on **${result}**!`);
  },
};
