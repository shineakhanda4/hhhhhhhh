const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'welcome',
  description: 'Setup welcome messages for new members',
  usage: '<enable|disable|channel|message|test>',
  permissions: [PermissionsBitField.Flags.Administrator],
  args: true,
  async execute(message, args, client) {
    const subCommand = args[0].toLowerCase();

    switch (subCommand) {
      case 'enable':
        client.config.welcome.enabled = true;
        return message.reply('✅ Welcome system has been enabled!');

      case 'disable':
        client.config.welcome.enabled = false;
        return message.reply('✅ Welcome system has been disabled!');

      case 'channel': {
        const channel = message.mentions.channels.first();
        if (!channel) {
          return message.reply('❌ Please mention a channel to set as the welcome channel!');
        }
        client.config.welcome.channel = channel.id;
        return message.reply(`✅ Welcome channel set to ${channel}!`);
      }

      case 'message': {
        const welcomeMessage = args.slice(1).join(' ');
        if (!welcomeMessage) {
          return message.reply('❌ Please provide a welcome message!\n\nVariables:\n`{user}` - Mentions the user\n`{username}` - User\'s name\n`{server}` - Server name\n`{membercount}` - Total members');
        }
        client.config.welcome.message = welcomeMessage;
        return message.reply('✅ Welcome message updated!');
      }

      case 'test': {
        if (!client.config.welcome.channel) {
          return message.reply('❌ Please set a welcome channel first using `!welcome channel #channel`');
        }

        const channel = message.guild.channels.cache.get(client.config.welcome.channel);
        if (!channel) {
          return message.reply('❌ Welcome channel not found!');
        }

        const welcomeMsg = client.config.welcome.message
          .replace('{user}', `${message.author}`)
          .replace('{username}', message.author.username)
          .replace('{server}', message.guild.name)
          .replace('{membercount}', message.guild.memberCount);

        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('👋 Welcome!')
          .setDescription(welcomeMsg)
          .setThumbnail(message.author.displayAvatarURL())
          .setFooter({ text: `Member #${message.guild.memberCount}` })
          .setTimestamp();

        await channel.send({ embeds: [embed] });
        return message.reply('✅ Test welcome message sent!');
      }

      case 'status': {
        const statusEmbed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle('👋 Welcome System Status')
          .addFields(
            { name: 'Enabled', value: client.config.welcome.enabled ? '✅ Yes' : '❌ No', inline: true },
            { name: 'Channel', value: client.config.welcome.channel ? `<#${client.config.welcome.channel}>` : 'Not set', inline: true },
            { name: 'Message', value: client.config.welcome.message || 'Not set', inline: false }
          )
          .setTimestamp();

        return message.reply({ embeds: [statusEmbed] });
      }

      default:
        const helpEmbed = new EmbedBuilder()
          .setColor(client.config.embedColor)
          .setTitle('👋 Welcome System Commands')
          .addFields(
            { name: `${client.config.prefix}welcome enable`, value: 'Enable welcome messages', inline: false },
            { name: `${client.config.prefix}welcome disable`, value: 'Disable welcome messages', inline: false },
            { name: `${client.config.prefix}welcome channel #channel`, value: 'Set welcome channel', inline: false },
            { name: `${client.config.prefix}welcome message <text>`, value: 'Set welcome message', inline: false },
            { name: `${client.config.prefix}welcome test`, value: 'Send a test welcome message', inline: false },
            { name: `${client.config.prefix}welcome status`, value: 'View current settings', inline: false },
            { name: 'Variables', value: '`{user}` `{username}` `{server}` `{membercount}`', inline: false }
          )
          .setTimestamp();

        return message.reply({ embeds: [helpEmbed] });
    }
  },
};
