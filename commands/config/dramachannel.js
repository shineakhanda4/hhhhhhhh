const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'dramachannel',
  aliases: ['setdrama'],
  description: 'Set the drama channel for moderation log overview',
  usage: 'dramachannel <#channel>',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply('❌ You need `Manage Server` permission to use this command!');
    }
    
    const channel = message.mentions.channels.first();
    
    if (!channel) {
      return message.reply('❌ Please mention a channel!');
    }
    
    client.config.logging.dramaChannel = channel.id;
    
    message.reply(`✅ Drama channel set to ${channel}! All moderation actions will be logged there.`);
  },
};
