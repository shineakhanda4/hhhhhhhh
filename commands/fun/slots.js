const { EmbedBuilder } = require('discord.js');

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
const multipliers = {
  '🍒': 2,
  '🍋': 3,
  '🍊': 4,
  '🍇': 5,
  '💎': 10,
  '7️⃣': 25
};

module.exports = {
  name: 'slots',
  aliases: ['slot', 'slotmachine'],
  description: 'Play the slot machine and win big!',
  usage: '<bet>',
  async execute(message, args, client) {
    const bet = parseInt(args[0]);

    if (!bet || bet < 1) {
      return message.reply('❌ Please specify a valid bet amount! (minimum: 1)');
    }

    const balance = await client.db.getBalance(message.guild.id, message.author.id);

    if (balance < bet) {
      return message.reply(`❌ You don't have enough money! Your balance: 💰 ${balance}`);
    }

    const result = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    let winAmount = 0;
    let winMessage = '';

    if (result[0] === result[1] && result[1] === result[2]) {
      const multiplier = multipliers[result[0]];
      winAmount = bet * multiplier;
      winMessage = `🎉 JACKPOT! All three match! You won **${winAmount}** coins! (${multiplier}x)`;
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      winAmount = Math.floor(bet * 1.5);
      winMessage = `✨ Two match! You won **${winAmount}** coins! (1.5x)`;
    } else {
      winAmount = -bet;
      winMessage = `❌ No match! You lost **${bet}** coins.`;
    }

    await client.db.addMoney(message.guild.id, message.author.id, winAmount);
    const newBalance = await client.db.getBalance(message.guild.id, message.author.id);

    const embed = new EmbedBuilder()
      .setColor(winAmount > 0 ? '#00FF00' : '#FF0000')
      .setTitle('🎰 Slot Machine')
      .setDescription(`**[ ${result.join(' | ')} ]**\n\n${winMessage}`)
      .addFields(
        { name: 'Bet', value: `💰 ${bet}`, inline: true },
        { name: 'New Balance', value: `💰 ${newBalance}`, inline: true }
      )
      .setFooter({ text: `${message.author.username}'s gambling session`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
