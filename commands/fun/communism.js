const { AttachmentBuilder } = require('discord.js');

module.exports = {
  name: 'communism',
  description: 'Our meme',
  usage: 'communism',
  async execute(message, args, client) {
    const url = 'https://api.memegen.link/images/comunism/my_meme/our_meme.png';
    
    const attachment = new AttachmentBuilder(url, { name: 'communism.png' });
    message.reply({ files: [attachment] });
  },
};
