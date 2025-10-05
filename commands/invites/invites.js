const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'invites',
  aliases: ['invitestats', 'inv'],
  description: 'Check invite statistics',
  usage: 'invites [@user]',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const stats = await client.db.getInviteStats(message.guild.id, user.id);
    
    const total = stats.total_invites - stats.left_invites - stats.fake_invites;
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({ name: `${user.tag}'s Invites`, iconURL: user.displayAvatarURL() })
      .addFields(
        { name: '📊 Total Invites', value: stats.total_invites.toString(), inline: true },
        { name: '✅ Valid Invites', value: total.toString(), inline: true },
        { name: '❌ Left/Fake', value: `${stats.left_invites + stats.fake_invites}`, inline: true }
      )
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
