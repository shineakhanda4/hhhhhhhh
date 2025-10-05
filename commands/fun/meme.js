const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'meme',
  description: 'Get a random meme',
  async execute(message, args, client) {
    try {
      const response = await axios.get('https://meme-api.com/gimme');
      const meme = response.data;

      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(meme.title)
        .setImage(meme.url)
        .setFooter({ text: `r/${meme.subreddit} | 👍 ${meme.ups}` })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to fetch a meme! Try again later.');
    }
  },
};
