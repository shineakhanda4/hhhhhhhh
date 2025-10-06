const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = newState.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const member = newState.member;

      if (!oldState.channel && newState.channel) {
        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('🎤 Voice Channel Joined')
          .addFields(
            { name: 'User', value: `${member.user.tag}`, inline: true },
            { name: 'Channel', value: `${newState.channel.name}`, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      } else if (oldState.channel && !newState.channel) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🚪 Voice Channel Left')
          .addFields(
            { name: 'User', value: `${member.user.tag}`, inline: true },
            { name: 'Channel', value: `${oldState.channel.name}`, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        const embed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('🔄 Voice Channel Switched')
          .addFields(
            { name: 'User', value: `${member.user.tag}`, inline: true },
            { name: 'From', value: `${oldState.channel.name}`, inline: true },
            { name: 'To', value: `${newState.channel.name}`, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }

      if (oldState.serverMute !== newState.serverMute || oldState.serverDeaf !== newState.serverDeaf) {
        const changes = [];
        if (oldState.serverMute !== newState.serverMute) {
          changes.push(`Server Mute: ${newState.serverMute ? 'Yes' : 'No'}`);
        }
        if (oldState.serverDeaf !== newState.serverDeaf) {
          changes.push(`Server Deafen: ${newState.serverDeaf ? 'Yes' : 'No'}`);
        }

        if (changes.length > 0) {
          const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🔊 Voice State Changed')
            .addFields(
              { name: 'User', value: `${member.user.tag}`, inline: true },
              { name: 'Changes', value: changes.join('\n'), inline: false }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error logging voice state update:', error);
    }
  },
};
