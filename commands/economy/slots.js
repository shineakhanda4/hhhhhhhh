const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'slots',
  aliases: ['slot'],
  description: 'Play the slot machine',
  usage: 'slots <amount>',
  async execute(message, args, client) {
    const amount = parseInt(args[0]);
    
    if (!amount || amount < 1) {
      return message.reply('❌ Please specify a valid amount to bet!');
    }
    
    const balance = await client.db.getBalance(message.author.id);
    
    if (balance.balance < amount) {
      return message.reply(`❌ You don't have enough Cowoncy! Your balance: ${balance.balance}`);
    }
    
    const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
    
    let winnings = 0;
    
    if (slot1 === slot2 && slot2 === slot3) {
      if (slot1 === '💎') winnings = amount * 10;
      else if (slot1 === '7️⃣') winnings = amount * 7;
      else winnings = amount * 3;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winnings = Math.floor(amount * 1.5);
    } else {
      winnings = -amount;
    }
    
    await client.db.addBalance(message.author.id, winnings);
    
    const embed = new EmbedBuilder()
      .setColor(winnings > 0 ? '#2ecc71' : '#e74c3c')
      .setTitle('🎰 Slot Machine')
      .setDescription(`${slot1} | ${slot2} | ${slot3}\n\n${winnings > 0 ? `You won **${winnings}** Cowoncy! 🎉` : `You lost **${Math.abs(winnings)}** Cowoncy! 😢`}`)
      .setFooter({ text: `New balance: ${balance.balance + winnings} Cowoncy` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
