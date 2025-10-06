const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'autopin',
  description: 'Configure auto-pinning messages with a certain number of reactions',
  usage: '<threshold>',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  async execute(message, args, client) {
    const threshold = parseInt(args[0]);

    if (!threshold || threshold < 1) {
      const current = await client.db.getAutopinThreshold(message.guild.id);
      return message.reply(`❌ Current auto-pin threshold: ${current || 'Disabled'}\n\nUsage: \`autopin <threshold>\` to set (minimum: 1)\nSet to 0 to disable.`);
    }

    if (threshold === 0) {
      await client.db.setAutopinThreshold(message.guild.id, null);
      return message.reply('✅ Auto-pin disabled!');
    }

    await client.db.setAutopinThreshold(message.guild.id, threshold);
    message.reply(`✅ Auto-pin threshold set to ${threshold} reactions! Messages with ${threshold}+ reactions will be automatically pinned.`);
  },
};
