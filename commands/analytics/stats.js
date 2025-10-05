const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stats',
  description: 'View bot statistics',
  aliases: ['botstats'],
  async execute(message, args, client) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📊 Bot Statistics')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '🖥️ Servers', value: client.guilds.cache.size.toString(), inline: true },
        { name: '👥 Users', value: client.users.cache.size.toString(), inline: true },
        { name: '📝 Commands', value: client.commands.size.toString(), inline: true },
        { name: '⏱️ Uptime', value: `${days}d ${hours}h ${minutes}m`, inline: true },
        { name: '💾 Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
        { name: '🏓 Ping', value: `${client.ws.ping}ms`, inline: true }
      )
      .setFooter({ text: 'Advanced Discord Bot' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
