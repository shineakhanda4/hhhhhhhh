const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'automod',
  description: 'Configure automod settings',
  usage: '<enable|disable|status>',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  args: true,
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!action) {
      return message.reply('❌ Usage: `automod <enable|disable|status>`');
    }

    if (action === 'enable') {
      client.config.automod.enabled = true;
      message.reply('✅ Automod enabled!');
    } else if (action === 'disable') {
      client.config.automod.enabled = false;
      message.reply('✅ Automod disabled!');
    } else if (action === 'status') {
      const config = client.config.automod;
      
      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🛡️ Automod Configuration')
        .addFields(
          { name: 'Status', value: config.enabled ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Spam Threshold', value: config.spamThreshold.toString(), inline: true },
          { name: 'Max Mentions', value: config.maxMentions.toString(), inline: true },
          { name: 'Max Emojis', value: config.maxEmojis.toString(), inline: true },
          { name: 'Caps Percentage', value: config.capsPercentage + '%', inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } else {
      message.reply('❌ Invalid action! Use: enable, disable, status');
    }
  },
};
