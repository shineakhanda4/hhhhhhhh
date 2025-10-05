const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'choose',
  aliases: ['pick', 'choice'],
  description: 'Choose between multiple options',
  usage: 'choose <option1> | <option2> | ...',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply('❌ Please provide options separated by `|`');
    }
    
    const options = args.join(' ').split('|').map(o => o.trim());
    
    if (options.length < 2) {
      return message.reply('❌ Please provide at least 2 options!');
    }
    
    const chosen = options[Math.floor(Math.random() * options.length)];
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('🤔 Choice')
      .setDescription(`I choose: **${chosen}**`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
