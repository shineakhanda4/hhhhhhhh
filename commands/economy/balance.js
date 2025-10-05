const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'balance',
  aliases: ['bal', 'money', 'cowoncy'],
  description: 'Check your Cowoncy balance',
  usage: 'balance [@user]',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const balance = await client.db.getBalance(user.id);
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({ name: `${user.tag}'s Balance`, iconURL: user.displayAvatarURL() })
      .addFields(
        { name: '💰 Wallet', value: `${balance.balance || 0} Cowoncy`, inline: true },
        { name: '🏦 Bank', value: `${balance.bank || 0} Cowoncy`, inline: true },
        { name: '💵 Total', value: `${(balance.balance || 0) + (balance.bank || 0)} Cowoncy`, inline: true }
      )
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
