const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'kiss',
  description: 'Kiss someone',
  usage: 'kiss <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to kiss!');
    }
    
    const gifs = [
      'https://media.tenor.com/images/dc2d0cea16c322872027ab3e4e8c7606/tenor.gif',
      'https://media.tenor.com/images/2c0b4e654b0d6e7d91f72b2e7b8c2a2e/tenor.gif'
    ];
    
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    
    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setDescription(`${message.author} kisses ${user}! 💋`)
      .setImage(randomGif)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
