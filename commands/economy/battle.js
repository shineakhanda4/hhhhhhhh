const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'battle',
  aliases: ['fight', 'duel'],
  description: 'Battle another user with your strongest animal',
  usage: 'battle <@user> <bet>',
  async execute(message, args, client) {
    const opponent = message.mentions.users.first();
    const bet = parseInt(args[1]);
    
    if (!opponent) {
      return message.reply('❌ Please mention someone to battle!');
    }
    
    if (opponent.id === message.author.id) {
      return message.reply('❌ You cannot battle yourself!');
    }
    
    if (opponent.bot) {
      return message.reply('❌ You cannot battle a bot!');
    }
    
    if (!bet || bet < 1) {
      return message.reply('❌ Please specify a valid bet amount!');
    }
    
    const authorBalance = await client.db.getBalance(message.author.id);
    const opponentBalance = await client.db.getBalance(opponent.id);
    
    if (authorBalance.balance < bet) {
      return message.reply(`❌ You don't have enough Cowoncy! Your balance: ${authorBalance.balance}`);
    }
    
    if (opponentBalance.balance < bet) {
      return message.reply(`❌ ${opponent.username} doesn't have enough Cowoncy!`);
    }
    
    const embed = new EmbedBuilder()
      .setColor('#e74c3c')
      .setTitle('⚔️ Battle Request')
      .setDescription(`${message.author} challenges ${opponent} to a battle!\n\n**Bet:** ${bet} Cowoncy\n\nWill you accept?`)
      .setTimestamp();
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('battle_accept')
          .setLabel('Accept ⚔️')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('battle_decline')
          .setLabel('Decline')
          .setStyle(ButtonStyle.Secondary)
      );
    
    const msg = await message.reply({ content: `${opponent}`, embeds: [embed], components: [row] });
    
    const collector = msg.createMessageComponentCollector({ time: 60000 });
    
    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== opponent.id) {
        return interaction.reply({ content: 'This battle is not for you!', ephemeral: true });
      }
      
      if (interaction.customId === 'battle_accept') {
        const authorAnimals = await client.db.getZoo(message.author.id);
        const opponentAnimals = await client.db.getZoo(opponent.id);
        
        const authorPower = authorAnimals.reduce((sum, a) => sum + a.count, 0) * 10 + Math.random() * 50;
        const opponentPower = opponentAnimals.reduce((sum, a) => sum + a.count, 0) * 10 + Math.random() * 50;
        
        const winner = authorPower > opponentPower ? message.author : opponent;
        const loser = winner.id === message.author.id ? opponent : message.author;
        
        await client.db.addBalance(winner.id, bet);
        await client.db.addBalance(loser.id, -bet);
        
        const battleEmbed = new EmbedBuilder()
          .setColor('#f1c40f')
          .setTitle('⚔️ Battle Results')
          .setDescription(`**${winner}** wins the battle!\n\n**${winner.username}** gains ${bet} Cowoncy 💰\n**${loser.username}** loses ${bet} Cowoncy 💸`)
          .setTimestamp();
        
        await interaction.update({ embeds: [battleEmbed], components: [] });
      } else {
        const declineEmbed = new EmbedBuilder()
          .setColor('#95a5a6')
          .setTitle('Battle Declined')
          .setDescription(`${opponent} declined the battle.`)
          .setTimestamp();
        
        await interaction.update({ embeds: [declineEmbed], components: [] });
      }
      
      collector.stop();
    });
    
    collector.on('end', (collected) => {
      if (collected.size === 0) {
        msg.edit({ content: 'Battle request expired.', components: [] });
      }
    });
  },
};
