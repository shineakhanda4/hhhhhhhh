const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'analytics',
  description: 'View server analytics (Unique Feature)',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  async execute(message, args, client) {
    const analytics = client.db.getAnalytics(message.guild.id);

    if (!analytics) {
      return message.reply('📊 No analytics data available yet. Start using the bot to generate data!');
    }

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📊 Server Analytics Dashboard')
      .setDescription('Real-time server activity metrics')
      .addFields(
        { name: '💬 Messages Sent', value: analytics.messagesSent.toString(), inline: true },
        { name: '📥 Members Joined', value: analytics.membersJoined.toString(), inline: true },
        { name: '📤 Members Left', value: analytics.membersLeft.toString(), inline: true },
        { name: '⚡ Commands Used', value: analytics.commandsUsed.toString(), inline: true },
        { name: '🛡️ Moderation Actions', value: analytics.moderationActions.toString(), inline: true },
        { name: '📈 Activity Score', value: calculateActivityScore(analytics).toString(), inline: true }
      )
      .setFooter({ text: '🌟 Unique AI-Powered Analytics Feature' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};

function calculateActivityScore(analytics) {
  return Math.floor(
    (analytics.messagesSent * 0.1) +
    (analytics.membersJoined * 10) +
    (analytics.commandsUsed * 2) +
    (analytics.moderationActions * 5)
  );
}
