const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'listadmins',
  aliases: ['admins', 'botadmins'],
  description: 'List all bot admins',
  usage: '',
  async execute(message, args, client) {
    if (client.config.adminIds.length === 0) {
      return message.reply('❌ No bot admins configured!');
    }

    const adminList = [];
    for (const adminId of client.config.adminIds) {
      const user = await client.users.fetch(adminId).catch(() => null);
      if (user) {
        adminList.push(`• ${user.tag} (${adminId})`);
      } else {
        adminList.push(`• Unknown User (${adminId})`);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('👑 Bot Admins')
      .setDescription(adminList.join('\n') || 'No admins found')
      .setFooter({ text: 'Bot admins can manage economy for all users' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
