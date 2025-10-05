const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'divorce',
  description: 'End your marriage',
  usage: 'divorce',
  async execute(message, args, client) {
    const marriage = await client.db.getMarriage(message.author.id);
    
    if (!marriage) {
      return message.reply('❌ You are not married!');
    }
    
    await client.db.deleteMarriage(message.author.id);
    
    const partnerId = marriage.user1_id === message.author.id ? marriage.user2_id : marriage.user1_id;
    const partner = await client.users.fetch(partnerId).catch(() => null);
    
    const embed = new EmbedBuilder()
      .setColor('#e74c3c')
      .setTitle('💔 Divorce')
      .setDescription(`${message.author} and ${partner ? partner.tag : 'Unknown User'} are no longer married.`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
