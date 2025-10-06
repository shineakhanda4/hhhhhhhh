const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function isAdmin(userId, client) {
  return client.config.adminIds.includes(userId) || client.config.ownerIds.includes(userId);
}

module.exports = {
  name: 'reseteconomy',
  description: 'Reset all economy data for this server (Bot Admin only)',
  usage: '',
  async execute(message, args, client) {
    if (!isAdmin(message.author.id, client)) {
      return message.reply('❌ This command is only available to bot admins!');
    }

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('⚠️ Reset Economy')
      .setDescription('Are you sure you want to reset ALL economy data for this server?\n\n**This will:**\n• Reset all user balances to 0\n• Clear all quest claims\n• This action cannot be undone!')
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('reset_confirm')
          .setLabel('Confirm Reset')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('reset_cancel')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
      );

    const msg = await message.reply({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({ time: 30000 });

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: 'Only the command user can confirm this action!', ephemeral: true });
      }

      if (interaction.customId === 'reset_confirm') {
        await client.db.resetServerEconomy(message.guild.id);

        const successEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ Economy Reset')
          .setDescription('All economy data for this server has been reset!')
          .setTimestamp();

        await interaction.update({ embeds: [successEmbed], components: [] });
      } else {
        const cancelEmbed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('❌ Reset Cancelled')
          .setDescription('Economy reset has been cancelled.')
          .setTimestamp();

        await interaction.update({ embeds: [cancelEmbed], components: [] });
      }

      collector.stop();
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        msg.edit({ content: 'Economy reset timed out.', components: [] });
      }
    });
  },
};
