const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const activeGames = new Map();

module.exports = {
  name: 'blackjack',
  description: 'Play a game of blackjack',
  aliases: ['bj', '21'],
  async execute(message, args, client) {
    if (activeGames.has(message.author.id)) {
      return message.reply('❌ You already have an active game! Finish it first.');
    }

    const deck = createDeck();
    const playerHand = [drawCard(deck), drawCard(deck)];
    const dealerHand = [drawCard(deck), drawCard(deck)];

    const gameData = {
      deck,
      playerHand,
      dealerHand,
      messageId: null,
    };

    activeGames.set(message.author.id, gameData);

    const embed = createGameEmbed(message.author, playerHand, dealerHand, false);
    const row = createButtons(false);

    const gameMessage = await message.reply({ embeds: [embed], components: [row] });
    gameData.messageId = gameMessage.id;

    setTimeout(() => {
      if (activeGames.has(message.author.id)) {
        activeGames.delete(message.author.id);
      }
    }, 60000);
  },
};

function createDeck() {
  const suits = ['♠️', '♥️', '♦️', '♣️'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  return deck.sort(() => Math.random() - 0.5);
}

function drawCard(deck) {
  return deck.pop();
}

function calculateHand(hand) {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'A') {
      aces++;
      value += 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function cardToString(card) {
  return `${card.value}${card.suit}`;
}

function createGameEmbed(author, playerHand, dealerHand, revealed) {
  const playerValue = calculateHand(playerHand);
  const dealerValue = calculateHand(dealerHand);

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🃏 Blackjack')
    .setDescription(`${author.username}'s Game`)
    .addFields(
      {
        name: '🎴 Your Hand',
        value: `${playerHand.map(cardToString).join(' ')} (${playerValue})`,
        inline: false,
      },
      {
        name: '🎴 Dealer\'s Hand',
        value: revealed
          ? `${dealerHand.map(cardToString).join(' ')} (${dealerValue})`
          : `${cardToString(dealerHand[0])} 🂠 (??)`,
        inline: false,
      }
    )
    .setTimestamp();

  return embed;
}

function createButtons(disabled) {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('blackjack_hit')
        .setLabel('Hit')
        .setStyle(ButtonStyle.Success)
        .setDisabled(disabled),
      new ButtonBuilder()
        .setCustomId('blackjack_stand')
        .setLabel('Stand')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled)
    );

  return row;
}

module.exports.activeGames = activeGames;
module.exports.calculateHand = calculateHand;
module.exports.drawCard = drawCard;
module.exports.createGameEmbed = createGameEmbed;
module.exports.createButtons = createButtons;
