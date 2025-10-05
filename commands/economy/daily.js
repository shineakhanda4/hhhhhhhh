const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'daily',
  description: 'Claim your daily Cowoncy reward',
  usage: 'daily',
  async execute(message, args, client) {
    const balance = await client.db.getBalance(message.author.id);
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (balance.daily_last && now - balance.daily_last < dayInMs) {
      const timeLeft = dayInMs - (now - balance.daily_last);
      const hours = Math.floor(timeLeft / (60 * 60 * 1000));
      const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
      
      return message.reply(`❌ You already claimed your daily reward! Come back in **${hours}h ${minutes}m**`);
    }
    
    const reward = 100 + Math.floor(Math.random() * 50);
    await client.db.addBalance(message.author.id, reward);
    await client.db.setDaily(message.author.id);
    
    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('💰 Daily Reward Claimed!')
      .setDescription(`You received **${reward} Cowoncy**!`)
      .setFooter({ text: `New balance: ${balance.balance + reward} Cowoncy` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
