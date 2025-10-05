const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'slowmode',
  description: 'Set slowmode delay for a channel',
  usage: '<seconds> [channel]',
  permissions: [PermissionsBitField.Flags.ManageChannels],
  args: true,
  async execute(message, args, client) {
    const seconds = parseInt(args[0]);
    
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
      return message.reply('❌ Please provide a valid number between 0 and 21600 seconds (6 hours)!\n\nUse 0 to disable slowmode.');
    }

    const channel = message.mentions.channels.first() || message.channel;

    try {
      await channel.setRateLimitPerUser(seconds);

      const embed = new EmbedBuilder()
        .setColor(seconds > 0 ? '#FFA500' : '#00FF00')
        .setTitle(seconds > 0 ? '⏱️ Slowmode Enabled' : '✅ Slowmode Disabled')
        .setDescription(seconds > 0 
          ? `Slowmode set to **${seconds} seconds** in ${channel}` 
          : `Slowmode disabled in ${channel}`)
        .setFooter({ text: `Set by ${message.author.tag}` })
        .setTimestamp();

      message.reply({ embeds: [embed] });
      await client.db.trackEvent(message.guild.id, 'moderationActions');
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to set slowmode!');
    }
  },
};
