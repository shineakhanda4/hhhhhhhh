const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'pat',
  description: 'Pat someone on the head',
  usage: 'pat <@user>',
  async execute(message, args, client) {
    const user = message.mentions.users.first();
    
    if (!user) {
      return message.reply('❌ Please mention someone to pat!');
    }
    
    const gifs = [
      'https://media.tenor.com/images/4ab190c4a4eda8a3b6c3c7b1c8f6e9c7/tenor.gif',
      'https://media.tenor.com/images/e5c8e8c8e8c8e8c8e8c8e8c8e8c8e8c8/tenor.gif'
    ];
    
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setDescription(`${message.author} pats ${user}'s head! 👋`)
      .setImage(randomGif)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
