const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'rank',
  aliases: ['level', 'xp'],
  description: 'Check your or another user\'s level and XP',
  usage: 'rank [@user]',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const data = await client.db.getUserLevel(message.guild.id, user.id);
    
    const xpNeeded = (data.level + 1) * 100;
    const progress = Math.floor((data.xp / xpNeeded) * 100);
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(`**Level:** ${data.level}\n**XP:** ${data.xp}/${xpNeeded}\n**Messages:** ${data.messages}\n**Progress:** ${'▰'.repeat(Math.floor(progress/10))}${'▱'.repeat(10-Math.floor(progress/10))} ${progress}%`)
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
