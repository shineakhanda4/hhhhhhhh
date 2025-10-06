const { EmbedBuilder } = require('discord.js');

function isAdmin(userId, client) {
  return client.config.adminIds.includes(userId) || client.config.ownerIds.includes(userId);
}

module.exports = {
  name: 'removemoney',
  aliases: ['takecoins', 'removecoins'],
  description: 'Remove money from a user (Bot Admin only)',
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

    await client.db.addMoney(message.guild.id, target.id, -amount);
    const newBalance = await client.db.getBalance(message.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('💸 Money Removed')
      .setDescription(`Removed **${amount}** coins from ${target}`)
      .addFields(
        { name: 'Admin', value: message.author.username, inline: true },
        { name: 'New Balance', value: `💰 ${newBalance}`, inline: true }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
