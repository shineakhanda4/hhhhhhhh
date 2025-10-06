const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'trade',
  description: 'Trade money or animals with another user',
  usage: '<@user> <amount|animal_id>',
  async execute(message, args, client) {
    const target = message.mentions.users.first();

    if (!target) {
      return message.reply('❌ Please mention a user to trade with!');
    }

    if (target.id === message.author.id) {
      return message.reply('❌ You cannot trade with yourself!');
    }

    if (target.bot) {
      return message.reply('❌ You cannot trade with a bot!');
    }

    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount < 1) {
      return message.reply('❌ Please specify a valid amount to trade!');
    }

    const balance = await client.db.getBalance(message.guild.id, message.author.id);
    if (balance < amount) {
      return message.reply(`❌ You don't have enough money! Your balance: 💰 ${balance}`);
    }

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('💱 Trade Offer')
      .setDescription(`${message.author} wants to trade **${amount}** coins with ${target}!`)
      .addFields(
        { name: 'Sender', value: message.author.username, inline: true },
        { name: 'Receiver', value: target.username, inline: true },
        { name: 'Amount', value: `💰 ${amount}`, inline: true }
      )
      .setFooter({ text: 'Trade expires in 60 seconds' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('trade_accept')
          .setLabel('Accept ✅')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('trade_decline')
          .setLabel('Decline ❌')
          .setStyle(ButtonStyle.Danger)
      );

    const tradeMessage = await message.reply({ content: `${target}`, embeds: [embed], components: [row] });

    const collector = tradeMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== target.id) {
        return interaction.reply({ content: 'This trade is not for you!', ephemeral: true });
      }

      if (interaction.customId === 'trade_accept') {
        await client.db.addMoney(message.guild.id, message.author.id, -amount);
        await client.db.addMoney(message.guild.id, target.id, amount);

        const successEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ Trade Completed!')
          .setDescription(`${message.author} successfully traded **${amount}** coins to ${target}!`)
          .setTimestamp();

        await interaction.update({ embeds: [successEmbed], components: [] });
      } else {
        const declineEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Trade Declined')
          .setDescription(`${target} declined the trade.`)
          .setTimestamp();

        await interaction.update({ embeds: [declineEmbed], components: [] });
      }

      collector.stop();
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        tradeMessage.edit({ content: 'Trade expired.', components: [] });
      }
    });
  },
};
