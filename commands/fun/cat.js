const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'cat',
  description: 'Get a random cat picture',
  aliases: ['kitty', 'kitten'],
  async execute(message, args, client) {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search');
      const catUrl = response.data[0].url;

      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🐱 Random Cat')
        .setImage(catUrl)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to fetch a cat picture! Try again later.');
    }
  },
};
