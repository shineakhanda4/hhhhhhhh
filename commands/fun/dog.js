const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'dog',
  description: 'Get a random dog picture',
  aliases: ['doggo', 'puppy'],
  async execute(message, args, client) {
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      const dogUrl = response.data.message;

      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🐕 Random Dog')
        .setImage(dogUrl)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to fetch a dog picture! Try again later.');
    }
  },
};
