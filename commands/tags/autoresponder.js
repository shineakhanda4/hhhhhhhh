const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'autoresponder',
  aliases: ['ar', 'autoreply'],
  description: 'Advanced auto-responder system with regex and wildcards',
  usage: '<add|remove|list|toggle> [trigger] [response]',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!action) {
      return message.reply('❌ Usage: `autoresponder <add|remove|list|toggle> [trigger] [response]`');
    }

    if (action === 'add') {
      const type = args[1]?.toLowerCase();
      if (!['exact', 'contains', 'regex', 'starts', 'ends'].includes(type)) {
        return message.reply('❌ Type must be: `exact`, `contains`, `regex`, `starts`, or `ends`');
      }

      const trigger = args[2];
      const response = args.slice(3).join(' ');

      if (!trigger || !response) {
        return message.reply('❌ Usage: `autoresponder add <type> <trigger> <response>`\n\n**Types:**\n• `exact` - Matches exact message\n• `contains` - Message contains trigger\n• `regex` - Regular expression pattern\n• `starts` - Message starts with trigger\n• `ends` - Message ends with trigger');
      }

      if (type === 'regex') {
        try {
          new RegExp(trigger);
        } catch (error) {
          return message.reply('❌ Invalid regex pattern!');
        }
      }

      await client.db.addAutoresponder(message.guild.id, trigger, response, type);
      message.reply(`✅ Autoresponder created!\n**Type:** ${type}\n**Trigger:** \`${trigger}\``);

    } else if (action === 'remove' || action === 'delete') {
      const trigger = args.slice(1).join(' ');

      if (!trigger) {
        return message.reply('❌ Usage: `autoresponder remove <trigger>`');
      }

      await client.db.removeAutoresponder(message.guild.id, trigger);
      message.reply(`✅ Autoresponder removed!`);

    } else if (action === 'list') {
      const autoresponders = await client.db.getAutoresponders(message.guild.id);

      if (!autoresponders || autoresponders.length === 0) {
        return message.reply('❌ No autoresponders configured!');
      }

      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle('📝 Autoresponders')
        .setDescription(autoresponders.map((ar, i) => 
          `**${i + 1}.** [${ar.type}] \`${ar.trigger}\` → ${ar.response.substring(0, 50)}${ar.response.length > 50 ? '...' : ''}`
        ).join('\n'))
        .setTimestamp();

      message.reply({ embeds: [embed] });

    } else if (action === 'toggle') {
      const enabled = await client.db.toggleAutoresponders(message.guild.id);
      message.reply(`✅ Autoresponders ${enabled ? 'enabled' : 'disabled'}!`);

    } else {
      message.reply('❌ Invalid action! Use: add, remove, list, toggle');
    }
  },
};
