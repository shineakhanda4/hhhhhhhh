const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'lockdown',
  description: 'Lock or unlock a channel',
  usage: '<lock|unlock> [channel] [reason]',
  permissions: [PermissionsBitField.Flags.ManageChannels],
  args: true,
  async execute(message, args, client) {
    const action = args[0].toLowerCase();
    const channel = message.mentions.channels.first() || message.channel;
    const reason = args.slice(message.mentions.channels.size > 0 ? 2 : 1).join(' ') || 'No reason provided';

    if (action !== 'lock' && action !== 'unlock') {
      return message.reply('❌ Usage: `!lockdown <lock|unlock> [#channel] [reason]`');
    }

    try {
      if (action === 'lock') {
        await channel.permissionOverwrites.edit(message.guild.id, {
          SendMessages: false,
        });

        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🔒 Channel Locked')
          .setDescription(`${channel} has been locked by ${message.author}`)
          .addFields({ name: 'Reason', value: reason })
          .setTimestamp();

        await channel.send({ embeds: [embed] });
        if (channel.id !== message.channel.id) {
          message.reply(`✅ Locked ${channel}!`);
        }
      } else {
        await channel.permissionOverwrites.edit(message.guild.id, {
          SendMessages: null,
        });

        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('🔓 Channel Unlocked')
          .setDescription(`${channel} has been unlocked by ${message.author}`)
          .addFields({ name: 'Reason', value: reason })
          .setTimestamp();

        await channel.send({ embeds: [embed] });
        if (channel.id !== message.channel.id) {
          message.reply(`✅ Unlocked ${channel}!`);
        }
      }

      await client.db.trackEvent(message.guild.id, 'moderationActions');
    } catch (error) {
      console.error(error);
      message.reply(`❌ Failed to ${action} the channel!`);
    }
  },
};
