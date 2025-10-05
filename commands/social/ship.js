const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ship',
  description: 'Ship two users together',
  usage: 'ship <@user1> <@user2>',
  async execute(message, args, client) {
    const user1 = message.mentions.users.first();
    const user2 = message.mentions.users.toArray()[1];
    
    if (!user1 || !user2) {
      return message.reply('❌ Please mention two users to ship!');
    }
    
    const percentage = Math.floor(Math.random() * 101);
    const hearts = '❤️'.repeat(Math.floor(percentage / 20));
    const emptyHearts = '🤍'.repeat(5 - Math.floor(percentage / 20));
    
    let status;
    if (percentage < 20) status = 'Not compatible 💔';
    else if (percentage < 40) status = 'Might work out 💙';
    else if (percentage < 60) status = 'Good match 💚';
    else if (percentage < 80) status = 'Great couple 💕';
    else status = 'Perfect match! 💖';
    
    const embed = new EmbedBuilder()
      .setColor('#ff69b4')
      .setTitle('💘 Matchmaker')
      .setDescription(`**${user1.username}** 💕 **${user2.username}**\n\n${hearts}${emptyHearts} **${percentage}%**\n\n${status}`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
