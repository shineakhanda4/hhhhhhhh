const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'hug',
  description: 'Hug someone',
  usage: 'hug <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to hug!');
    }
    
    const gifs = [
      'https://media.tenor.com/images/c1b8df497b7c3c6c67b1c49e1b89d836/tenor.gif',
      'https://media.tenor.com/images/be4c83ba33dc8d26a1fad0ca93c8c1a1/tenor.gif',
      'https://media.tenor.com/images/e32a0b34f62a6d9ecd7ab44e4f246ef3/tenor.gif'
    ];
    
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setDescription(`${message.author} hugs ${user}! 🤗`)
      .setImage(randomGif)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
