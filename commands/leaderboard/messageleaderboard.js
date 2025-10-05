const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageleaderboard',
  aliases: ['msglb', 'messagetop'],
  description: 'View the server message leaderboard',
  usage: 'messageleaderboard',
  async execute(message, args, client) {
    const topMessagers = await client.db.getTopMessagers(message.guild.id, 10);
    
    if (topMessagers.length === 0) {
      return message.reply('No message data available yet!');
    }
    
    let description = '';
    for (let i = 0; i < topMessagers.length; i++) {
      const user = await client.users.fetch(topMessagers[i].user_id).catch(() => null);
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      description += `${medal} **${user ? user.tag : 'Unknown User'}** - ${topMessagers[i].message_count} messages\n`;
    }
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('📊 Message Leaderboard')
      .setDescription(description)
      .setFooter({ text: message.guild.name })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
