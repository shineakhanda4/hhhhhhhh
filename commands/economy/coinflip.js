const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'coinflip',
  aliases: ['cf', 'flip'],
  description: 'Flip a coin and bet Cowoncy',
  usage: 'coinflip <amount> <heads/tails>',
  async execute(message, args, client) {
    const amount = parseInt(args[0]);
    const choice = args[1]?.toLowerCase();
    
    if (!amount || amount < 1) {
      return message.reply('❌ Please specify a valid amount to bet!');
    }
    
    if (choice !== 'heads' && choice !== 'tails') {
      return message.reply('❌ Please choose `heads` or `tails`!');
    }
    
    const balance = await client.db.getBalance(message.author.id);
    
    if (balance.balance < amount) {
      return message.reply(`❌ You don't have enough Cowoncy! Your balance: ${balance.balance}`);
    }
    
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === choice;
    const winnings = won ? amount : -amount;
    
    await client.db.addBalance(message.author.id, winnings);
    
    const embed = new EmbedBuilder()
      .setColor(won ? '#2ecc71' : '#e74c3c')
      .setTitle('🪙 Coin Flip')
      .setDescription(`The coin landed on **${result}**!\n\n${won ? `You won **${amount}** Cowoncy! 🎉` : `You lost **${amount}** Cowoncy! 😢`}`)
      .setFooter({ text: `New balance: ${balance.balance + winnings} Cowoncy` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
