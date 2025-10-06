const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'vcstats',
  aliases: ['voicestats', 'voicetime'],
  description: 'View voice channel statistics',
  usage: '[@user]',
  async execute(message, args, client) {
    const target = message.mentions.users.first() || message.author;

    const stats = await client.db.getVoiceStats(message.guild.id, target.id);

    if (!stats || stats.totalTime === 0) {
      return message.reply(`❌ ${target.username} has no voice activity recorded!`);
    }

    const hours = Math.floor(stats.totalTime / 3600000);
    const minutes = Math.floor((stats.totalTime % 3600000) / 60000);

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle(`🎤 Voice Statistics`)
      .setDescription(`Voice activity stats for ${target}`)
      .addFields(
        { name: 'Total Time', value: `${hours}h ${minutes}m`, inline: true },
        { name: 'Sessions', value: `${stats.sessions || 0}`, inline: true },
        { name: 'Most Active Channel', value: stats.favoriteChannel || 'N/A', inline: false }
      )
      .setThumbnail(target.displayAvatarURL())
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
