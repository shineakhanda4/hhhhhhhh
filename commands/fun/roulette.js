const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'roulette',
  description: 'Play roulette! Bet on red, black, or a specific number',
  usage: '<bet> <red|black|number>',
  async execute(message, args, client) {
    const bet = parseInt(args[0]);
    const choice = args[1]?.toLowerCase();

    if (!bet || bet < 1) {
      return message.reply('❌ Please specify a valid bet amount! (minimum: 1)');
    }

    if (!choice) {
      return message.reply('❌ Usage: `roulette <bet> <red|black|0-36>`');
    }

    const balance = await client.db.getBalance(message.guild.id, message.author.id);

    if (balance < bet) {
      return message.reply(`❌ You don't have enough money! Your balance: 💰 ${balance}`);
    }

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    const result = Math.floor(Math.random() * 37);
    
    let color = 'green';
    if (redNumbers.includes(result)) color = 'red';
    if (blackNumbers.includes(result)) color = 'black';

    let winAmount = 0;
    let winMessage = '';

    if (choice === 'red' || choice === 'black') {
      if (choice === color) {
        winAmount = bet * 2;
        winMessage = `🎉 You won! The ball landed on ${result} (${color})`;
      } else {
        winAmount = -bet;
        winMessage = `❌ You lost! The ball landed on ${result} (${color})`;
      }
    } else {
      const numberChoice = parseInt(choice);
      if (isNaN(numberChoice) || numberChoice < 0 || numberChoice > 36) {
        return message.reply('❌ Please choose red, black, or a number between 0-36!');
      }

      if (numberChoice === result) {
        winAmount = bet * 35;
        winMessage = `🎊 INCREDIBLE! Direct hit on ${result}! You won **${winAmount}** coins! (35x)`;
      } else {
        winAmount = -bet;
        winMessage = `❌ You lost! The ball landed on ${result} (${color})`;
      }
    }

    await client.db.addMoney(message.guild.id, message.author.id, winAmount);
    const newBalance = await client.db.getBalance(message.guild.id, message.author.id);

    const embed = new EmbedBuilder()
      .setColor(winAmount > 0 ? '#00FF00' : '#FF0000')
      .setTitle('🎡 Roulette')
      .setDescription(`🎰 The wheel spins...\n\n**Result: ${result}** ${color === 'red' ? '🔴' : color === 'black' ? '⚫' : '🟢'}\n\n${winMessage}`)
      .addFields(
        { name: 'Bet', value: `💰 ${bet}`, inline: true },
        { name: 'Your Choice', value: choice, inline: true },
        { name: 'New Balance', value: `💰 ${newBalance}`, inline: true }
      )
      .setFooter({ text: `${message.author.username}'s gambling session`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
