const { AttachmentBuilder } = require('discord.js');

module.exports = {
  name: 'distractedbf',
  aliases: ['distracted'],
  description: 'Create a distracted boyfriend meme',
  usage: 'distractedbf <text1> | <text2> | <text3>',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply('❌ Usage: `distractedbf <text1> | <text2> | <text3>`');
    }
    
    const text = args.join(' ').split('|');
    if (text.length !== 3) {
      return message.reply('❌ Please provide three texts separated with `|`');
    }
    
    const [boyfriend, other, girlfriend] = text.map(t => encodeURIComponent(t.trim()));
    const url = `https://api.memegen.link/images/distracted/${boyfriend}/${other}/${girlfriend}.png`;
    
    const attachment = new AttachmentBuilder(url, { name: 'distracted.png' });
    message.reply({ files: [attachment] });
  },
};
