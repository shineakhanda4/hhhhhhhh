const { EmbedBuilder } = require('discord.js');

function isAdmin(userId, client) {
  return client.config.adminIds.includes(userId) || client.config.ownerIds.includes(userId);
}

module.exports = {
  name: 'addmoney',
  aliases: ['addcoins', 'givecoins'],
  description: 'Add money to a user (Bot Admin only)',
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

    if (!amount || amount < 1) {
      return message.reply('❌ Please specify a valid amount!');
    }

    await client.db.addMoney(message.guild.id, target.id, amount);
    const newBalance = await client.db.getBalance(message.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('💰 Money Added')
      .setDescription(`Added **${amount}** coins to ${target}`)
      .addFields(
        { name: 'Admin', value: message.author.username, inline: true },
        { name: 'New Balance', value: `💰 ${newBalance}`, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
