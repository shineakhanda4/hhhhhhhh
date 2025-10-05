const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'announce',
  description: 'Make an announcement',
  usage: '<message>',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  args: true,
  async execute(message, args, client) {
    const announcement = args.join(' ');

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📢 Announcement')
      .setDescription(announcement)
      .setFooter({ text: `By ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    message.delete().catch(() => {});
  },
};
