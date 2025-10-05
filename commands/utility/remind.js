const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'remind',
  description: 'Set a reminder',
  usage: '<time_in_minutes> <message>',
  aliases: ['reminder'],
  args: true,
  async execute(message, args, client) {
    const time = parseInt(args[0]);
    if (isNaN(time) || time < 1) {
      return message.reply('❌ Please provide a valid time in minutes!');
    }

    const reminderMessage = args.slice(1).join(' ');
    if (!reminderMessage) {
      return message.reply('❌ Please provide a reminder message!');
    }

    const reminderTime = Date.now() + (time * 60 * 1000);
    
    client.db.addReminder(message.author.id, {
      message: reminderMessage,
      time: reminderTime,
      channelId: message.channel.id,
    });

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('⏰ Reminder Set')
      .setDescription(`I'll remind you in ${time} minutes about: ${reminderMessage}`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
