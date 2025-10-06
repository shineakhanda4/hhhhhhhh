const { EmbedBuilder } = require('discord.js');

function isAdmin(userId, client) {
  return client.config.adminIds.includes(userId) || client.config.ownerIds.includes(userId);
}

module.exports = {
  name: 'setbalance',
  aliases: ['setbal', 'setmoney'],
  description: 'Set a user\'s balance (Bot Admin only)',
  usage: '<@user> <amount>',
  async execute(message, args, client) {
    if (!isAdmin(message.author.id, client)) {
      return message.reply('❌ This command is only available to bot admins!');
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target) {
      return message.reply('❌ Please mention a user!');
    }

    if (isNaN(amount) || amount < 0) {
      return message.reply('❌ Please specify a valid amount (minimum: 0)!');
    }

    const currentBalance = await client.db.getBalance(message.guild.id, target.id);
    const difference = amount - currentBalance;

    await client.db.addMoney(message.guild.id, target.id, difference);

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('💰 Balance Set')
      .setDescription(`Set ${target}'s balance to **${amount}** coins`)
      .addFields(
        { name: 'Admin', value: message.author.username, inline: true },
        { name: 'Previous Balance', value: `💰 ${currentBalance}`, inline: true },
        { name: 'New Balance', value: `💰 ${amount}`, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
