const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'zoo',
  aliases: ['animals', 'collection'],
  description: 'View your animal collection',
  usage: 'zoo [@user]',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const animals = await client.db.getZoo(user.id);
    
    if (animals.length === 0) {
      return message.reply(`${user.id === message.author.id ? 'You don\'t' : `${user.tag} doesn't`} have any animals yet!`);
    }
    
    const grouped = {};
    animals.forEach(animal => {
      if (!grouped[animal.rarity]) grouped[animal.rarity] = [];
      grouped[animal.rarity].push(`${animal.name} x${animal.count}`);
    });
    
    let description = '';
    const order = ['common', 'uncommon', 'rare', 'epic', 'mythical', 'legendary'];
    
    for (const rarity of order) {
      if (grouped[rarity]) {
        description += `\n**${rarity.toUpperCase()}**\n${grouped[rarity].join('\n')}\n`;
      }
    }
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({ name: `${user.tag}'s Zoo`, iconURL: user.displayAvatarURL() })
      .setDescription(description || 'No animals yet!')
      .setFooter({ text: `Total animals: ${animals.reduce((a, b) => a + b.count, 0)}` })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
