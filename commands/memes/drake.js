const { AttachmentBuilder } = require('discord.js');

module.exports = {
  name: 'drake',
  description: 'Create a drake meme',
  usage: 'drake <text1> | <text2>',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply('❌ Usage: `drake <text1> | <text2>`');
    }
    
    const text = args.join(' ').split('|');
    if (text.length !== 2) {
      return message.reply('❌ Please separate the two texts with `|`');
    }
    
    const [bad, good] = text.map(t => encodeURIComponent(t.trim()));
    const url = `https://api.memegen.link/images/drake/${bad}/${good}.png`;
    
    const attachment = new AttachmentBuilder(url, { name: 'drake.png' });
    message.reply({ files: [attachment] });
  },
};
