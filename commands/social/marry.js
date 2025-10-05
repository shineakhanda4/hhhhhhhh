const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'marry',
  aliases: ['propose'],
  description: 'Propose marriage to another user',
  usage: 'marry <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention a user to propose to!');
    }
    
    if (user.id === message.author.id) {
      return message.reply('❌ You cannot marry yourself!');
    }
    
    if (user.bot) {
      return message.reply('❌ You cannot marry a bot!');
    }
    
    const authorMarriage = await client.db.getMarriage(message.author.id);
    if (authorMarriage) {
      return message.reply('❌ You are already married! Divorce first with `divorce`');
    }
    
    const userMarriage = await client.db.getMarriage(user.id);
    if (userMarriage) {
      return message.reply('❌ That user is already married!');
    }
    
    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setTitle('💍 Marriage Proposal')
      .setDescription(`${message.author} proposed to ${user}!\n\nWill you accept?`)
      .setTimestamp();
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('marry_accept')
          .setLabel('Accept 💕')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('marry_deny')
          .setLabel('Decline 💔')
          .setStyle(ButtonStyle.Danger)
      );
    
    const msg = await message.reply({ content: `${user}`, embeds: [embed], components: [row] });
    
    const collector = msg.createMessageComponentCollector({ time: 60000 });
    
    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== user.id) {
        return interaction.reply({ content: 'This proposal is not for you!', ephemeral: true });
      }
      
      if (interaction.customId === 'marry_accept') {
        await client.db.createMarriage(message.author.id, user.id);
        
        const successEmbed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('💖 Marriage Successful!')
          .setDescription(`${message.author} and ${user} are now married! Congratulations! 🎉`)
          .setTimestamp();
        
        await interaction.update({ embeds: [successEmbed], components: [] });
      } else {
        const denyEmbed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('💔 Proposal Declined')
          .setDescription(`${user} declined the marriage proposal.`)
          .setTimestamp();
        
        await interaction.update({ embeds: [denyEmbed], components: [] });
      }
      
      collector.stop();
    });
    
    collector.on('end', (collected) => {
      if (collected.size === 0) {
        msg.edit({ content: 'Marriage proposal expired.', components: [] });
      }
    });
  },
};
