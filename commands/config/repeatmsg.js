const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'repeatmsg',
  aliases: ['repeat', 'repeating'],
  description: 'Create a repeating message in a channel',
  usage: 'repeatmsg <interval_minutes> <#channel> <message>',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply('❌ You need `Manage Server` permission to use this command!');
    }
    
    const interval = parseInt(args[0]);
    const channel = message.mentions.channels.first();
    const messageText = args.slice(2).join(' ');
    
    if (!interval || interval < 1) {
      return message.reply('❌ Please provide a valid interval in minutes!');
    }
    
    if (!channel) {
      return message.reply('❌ Please mention a channel!');
    }
    
    if (!messageText) {
      return message.reply('❌ Please provide a message to repeat!');
    }
    
    const intervalMs = interval * 60 * 1000;
    
    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('✅ Repeating Message Created')
      .setDescription(`Message will be sent every **${interval} minutes** in ${channel}`)
      .addFields({ name: 'Message', value: messageText })
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
    
    setInterval(() => {
      channel.send(messageText).catch(() => {});
    }, intervalMs);
  },
};
