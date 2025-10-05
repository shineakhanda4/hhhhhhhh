const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'starboard',
  description: 'Setup starboard to highlight popular messages',
  usage: '<enable|disable|channel|threshold>',
  permissions: [PermissionsBitField.Flags.Administrator],
  args: true,
  async execute(message, args, client) {
    const subCommand = args[0].toLowerCase();

    switch (subCommand) {
      case 'enable':
        if (!client.config.starboard.channel) {
          return message.reply('❌ Please set a starboard channel first using `!starboard channel #channel`');
        }
        client.config.starboard.enabled = true;
        return message.reply('✅ Starboard has been enabled!');

      case 'disable':
        client.config.starboard.enabled = false;
        return message.reply('✅ Starboard has been disabled!');

      case 'channel': {
        const channel = message.mentions.channels.first();
        if (!channel) {
          return message.reply('❌ Please mention a channel to set as the starboard channel!');
        }
        client.config.starboard.channel = channel.id;
        return message.reply(`✅ Starboard channel set to ${channel}!`);
      }

      case 'threshold': {
        const threshold = parseInt(args[1]);
        if (isNaN(threshold) || threshold < 1) {
          return message.reply('❌ Please provide a valid number (minimum 1)!');
        }
        client.config.starboard.threshold = threshold;
        return message.reply(`✅ Starboard threshold set to ${threshold} stars!`);
      }

      case 'status': {
        const statusEmbed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle('⭐ Starboard Status')
          .addFields(
            { name: 'Enabled', value: client.config.starboard.enabled ? '✅ Yes' : '❌ No', inline: true },
            { name: 'Channel', value: client.config.starboard.channel ? `<#${client.config.starboard.channel}>` : 'Not set', inline: true },
            { name: 'Threshold', value: client.config.starboard.threshold.toString(), inline: true },
            { name: 'Emoji', value: client.config.starboard.emoji, inline: true }
          )
          .setTimestamp();

        return message.reply({ embeds: [statusEmbed] });
      }

      default:
        const helpEmbed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle('⭐ Starboard Commands')
          .addFields(
            { name: `${client.config.prefix}starboard enable`, value: 'Enable starboard', inline: false },
            { name: `${client.config.prefix}starboard disable`, value: 'Disable starboard', inline: false },
            { name: `${client.config.prefix}starboard channel #channel`, value: 'Set starboard channel', inline: false },
            { name: `${client.config.prefix}starboard threshold <number>`, value: 'Set star threshold (default: 5)', inline: false },
            { name: `${client.config.prefix}starboard status`, value: 'View current settings', inline: false }
          )
          .setTimestamp();

        return message.reply({ embeds: [helpEmbed] });
    }
  },
};
