const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const activeGames = new Map();

module.exports = {
  name: 'rps',
  description: 'Play rock, paper, scissors',
  aliases: ['rockpaperscissors'],
  async execute(message, args, client) {
    if (activeGames.has(message.author.id)) {
      return message.reply('❌ You already have an active game!');
    }

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🪨📄✂️ Rock Paper Scissors')
      .setDescription('Choose your move!')
      .setFooter({ text: `Game by ${message.author.username}` })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('rps_rock')
          .setLabel('Rock')
          .setEmoji('🪨')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('rps_paper')
          .setLabel('Paper')
          .setEmoji('📄')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('rps_scissors')
          .setLabel('Scissors')
          .setEmoji('✂️')
          .setStyle(ButtonStyle.Secondary)
      );

    const gameMessage = await message.reply({ embeds: [embed], components: [row] });
    
    activeGames.set(message.author.id, {
      messageId: gameMessage.id,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      if (activeGames.has(message.author.id)) {
        activeGames.delete(message.author.id);
      }
    }, 30000);
  },
};

module.exports.activeGames = activeGames;
