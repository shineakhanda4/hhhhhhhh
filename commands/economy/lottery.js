const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'lottery',
  aliases: ['lotto'],
  description: 'Play the lottery for a chance to win big!',
  usage: 'lottery',
  async execute(message, args, client) {
    const cost = 50;
    const balance = await client.db.getBalance(message.author.id);
    
    if (balance.balance < cost) {
      return message.reply(`❌ You need ${cost} Cowoncy to play the lottery! Your balance: ${balance.balance}`);
    }
    
    await client.db.addBalance(message.author.id, -cost);
    
    const chance = Math.random();
    let winnings = 0;
    let prize = 'Nothing';
    
    if (chance < 0.01) {
      winnings = 5000;
      prize = 'JACKPOT! 🎊';
    } else if (chance < 0.05) {
      winnings = 500;
      prize = 'Big Win! 🎉';
    } else if (chance < 0.15) {
      winnings = 100;
      prize = 'Small Win! 🎁';
    } else if (chance < 0.30) {
      winnings = 50;
      prize = 'Break Even';
    }
    
    if (winnings > 0) {
      await client.db.addBalance(message.author.id, winnings);
    }
    
    const embed = new EmbedBuilder()
      .setColor(winnings >= cost ? '#2ecc71' : '#e74c3c')
      .setTitle('🎰 Lottery Results')
      .setDescription(`You won: **${prize}**\n\n${winnings > 0 ? `Prize: **${winnings}** Cowoncy!` : 'Better luck next time!'}`)
      .setFooter({ text: `New balance: ${balance.balance - cost + winnings} Cowoncy` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
