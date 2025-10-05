const { EmbedBuilder } = require('discord.js');

const animals = [
  { name: '🐶 Dog', rarity: 'common', chance: 30 },
  { name: '🐱 Cat', rarity: 'common', chance: 30 },
  { name: '🐭 Mouse', rarity: 'common', chance: 20 },
  { name: '🦊 Fox', rarity: 'uncommon', chance: 15 },
  { name: '🐼 Panda', rarity: 'rare', chance: 10 },
  { name: '🦁 Lion', rarity: 'rare', chance: 8 },
  { name: '🐉 Dragon', rarity: 'epic', chance: 4 },
  { name: '🦄 Unicorn', rarity: 'mythical', chance: 2 },
  { name: '👑 Phoenix', rarity: 'legendary', chance: 1 },
];

module.exports = {
  name: 'hunt',
  aliases: ['h', 'catch'],
  description: 'Hunt for animals to add to your zoo',
  usage: 'hunt',
  async execute(message, args, client) {
    const balance = await client.db.getBalance(message.author.id);
    
    if (balance.balance < 5) {
      return message.reply('❌ You need at least 5 Cowoncy to hunt!');
    }
    
    await client.db.addBalance(message.author.id, -5);
    
    const rand = Math.random() * 100;
    let cumulative = 0;
    let caught = null;
    
    for (const animal of animals) {
      cumulative += animal.chance;
      if (rand <= cumulative) {
        caught = animal;
        break;
      }
    }
    
    if (!caught) caught = animals[0];
    
    await client.db.addAnimal(message.author.id, caught.name, caught.rarity);
    
    const rarityColors = {
      common: '#95a5a6',
      uncommon: '#2ecc71',
      rare: '#3498db',
      epic: '#9b59b6',
      mythical: '#e91e63',
      legendary: '#f1c40f',
    };
    
    const embed = new EmbedBuilder()
      .setColor(rarityColors[caught.rarity])
      .setTitle('🎯 Hunt Successful!')
      .setDescription(`You caught a **${caught.name}**!\nRarity: **${caught.rarity.toUpperCase()}**`)
      .setFooter({ text: `Cost: 5 Cowoncy | Balance: ${balance.balance - 5}` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
