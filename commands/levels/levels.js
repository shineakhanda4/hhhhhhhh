const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'levels',
  aliases: ['leveltop', 'toplevel'],
  description: 'View the server level leaderboard',
  usage: 'levels',
  async execute(message, args, client) {
    const topUsers = await client.db.getTopLevels(message.guild.id, 10);
    
    if (topUsers.length === 0) {
      return message.reply('No level data available yet!');
    }
    
    let description = '';
    for (let i = 0; i < topUsers.length; i++) {
      const user = await client.users.fetch(topUsers[i].user_id).catch(() => null);
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      description += `${medal} **${user ? user.tag : 'Unknown User'}** - Level ${topUsers[i].level} (${topUsers[i].xp} XP)\n`;
    }
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('📊 Level Leaderboard')
      .setDescription(description)
      .setFooter({ text: message.guild.name })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
