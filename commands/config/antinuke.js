const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'antinuke',
  description: 'Manage anti-nuke protection settings',
  usage: '<enable|disable|whitelist|unwhitelist|list> [user]',
  permissions: [PermissionsBitField.Flags.Administrator],
  args: true,
  async execute(message, args, client) {
    const subCommand = args[0].toLowerCase();

    switch (subCommand) {
      case 'enable':
        client.config.antinuke.enabled = true;
        const enableEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('🛡️ Anti-Nuke Enabled')
          .setDescription('Anti-nuke protection has been enabled for this server!')
          .addFields(
            { name: 'Max Channel Deletes', value: `${client.config.antinuke.maxChannelDeletes} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Max Role Deletes', value: `${client.config.antinuke.maxRoleDeletes} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Max Bans', value: `${client.config.antinuke.maxBans} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Max Kicks', value: `${client.config.antinuke.maxKicks} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Punishment', value: client.config.antinuke.punishmentType.replace('_', ' '), inline: true }
          )
          .setFooter({ text: 'Use !antinuke whitelist @user to whitelist trusted users' })
          .setTimestamp();
        return message.reply({ embeds: [enableEmbed] });

      case 'disable':
        client.config.antinuke.enabled = false;
        const disableEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🛡️ Anti-Nuke Disabled')
          .setDescription('Anti-nuke protection has been disabled for this server.')
          .setTimestamp();
        return message.reply({ embeds: [disableEmbed] });

      case 'whitelist': {
        const user = message.mentions.users.first();
        if (!user) {
          return message.reply('❌ Please mention a user to whitelist!');
        }

        try {
          await client.db.addToAntiNukeWhitelist(message.guild.id, user.id);
          const whitelistEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ User Whitelisted')
            .setDescription(`${user.tag} has been added to the anti-nuke whitelist.`)
            .setFooter({ text: 'Whitelisted users can bypass anti-nuke protection' })
            .setTimestamp();
          return message.reply({ embeds: [whitelistEmbed] });
        } catch (error) {
          console.error('Error whitelisting user:', error);
          return message.reply('❌ Failed to whitelist user!');
        }
      }

      case 'unwhitelist': {
        const user = message.mentions.users.first();
        if (!user) {
          return message.reply('❌ Please mention a user to remove from whitelist!');
        }

        try {
          await client.db.removeFromAntiNukeWhitelist(message.guild.id, user.id);
          const unwhitelistEmbed = new EmbedBuilder()
            .setColor('#FF9900')
            .setTitle('✅ User Removed from Whitelist')
            .setDescription(`${user.tag} has been removed from the anti-nuke whitelist.`)
            .setTimestamp();
          return message.reply({ embeds: [unwhitelistEmbed] });
        } catch (error) {
          console.error('Error removing user from whitelist:', error);
          return message.reply('❌ Failed to remove user from whitelist!');
        }
      }

      case 'list': {
        try {
          const whitelistedUserIds = await client.db.getWhitelistedUsers(message.guild.id);
          
          if (whitelistedUserIds.length === 0) {
            return message.reply('No users are currently whitelisted.');
          }

          const userList = whitelistedUserIds.map((userId, index) => {
            return `${index + 1}. <@${userId}>`;
          }).join('\n');

          const listEmbed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setTitle('🛡️ Anti-Nuke Whitelist')
            .setDescription(userList)
            .setFooter({ text: `Total: ${whitelistedUserIds.length} whitelisted users` })
            .setTimestamp();
          return message.reply({ embeds: [listEmbed] });
        } catch (error) {
          console.error('Error fetching whitelist:', error);
          return message.reply('❌ Failed to fetch whitelist!');
        }
      }

      case 'status': {
        const statusEmbed = new EmbedBuilder()
          .setColor(client.config.antinuke.enabled ? '#00FF00' : '#FF0000')
          .setTitle('🛡️ Anti-Nuke Status')
          .setDescription(`Protection is currently **${client.config.antinuke.enabled ? 'ENABLED' : 'DISABLED'}**`)
          .addFields(
            { name: 'Max Channel Deletes', value: `${client.config.antinuke.maxChannelDeletes} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Max Role Deletes', value: `${client.config.antinuke.maxRoleDeletes} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Max Bans', value: `${client.config.antinuke.maxBans} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Max Kicks', value: `${client.config.antinuke.maxKicks} within ${client.config.antinuke.timeWindow / 1000}s`, inline: true },
            { name: 'Punishment Type', value: client.config.antinuke.punishmentType.replace('_', ' '), inline: true }
          )
          .setTimestamp();
        return message.reply({ embeds: [statusEmbed] });
      }

      default:
        const helpEmbed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle('🛡️ Anti-Nuke Commands')
          .setDescription('Protect your server from malicious actions')
          .addFields(
            { name: `${client.config.prefix}antinuke enable`, value: 'Enable anti-nuke protection', inline: false },
            { name: `${client.config.prefix}antinuke disable`, value: 'Disable anti-nuke protection', inline: false },
            { name: `${client.config.prefix}antinuke status`, value: 'Check current anti-nuke status', inline: false },
            { name: `${client.config.prefix}antinuke whitelist @user`, value: 'Add user to whitelist', inline: false },
            { name: `${client.config.prefix}antinuke unwhitelist @user`, value: 'Remove user from whitelist', inline: false },
            { name: `${client.config.prefix}antinuke list`, value: 'List all whitelisted users', inline: false }
          )
          .setFooter({ text: 'Administrator permission required' })
          .setTimestamp();
        return message.reply({ embeds: [helpEmbed] });
    }
  },
};
