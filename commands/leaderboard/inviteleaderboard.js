const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'inviteleaderboard',
  aliases: ['invitelb', 'invitetop'],
  description: 'View the server invite leaderboard',
  usage: 'inviteleaderboard',
  async execute(message, args, client) {
    const topInviters = await client.db.getTopInviters(message.guild.id, 10);
    
    if (topInviters.length === 0) {
      return message.reply('No invite data available yet!');
    }
    
    let description = '';
    for (let i = 0; i < topInviters.length; i++) {
      const user = await client.users.fetch(topInviters[i].user_id).catch(() => null);
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const validInvites = topInviters[i].total_invites - topInviters[i].left_invites - topInviters[i].fake_invites;
      description += `${medal} **${user ? user.tag : 'Unknown User'}** - ${validInvites} invites\n`;
    }
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('📊 Invite Leaderboard')
      .setDescription(description)
      .setFooter({ text: message.guild.name })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
