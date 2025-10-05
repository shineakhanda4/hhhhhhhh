const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'embed',
  description: 'Create a custom embed',
  usage: '<json>',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  args: true,
  async execute(message, args, client) {
    const jsonString = args.join(' ');

    try {
      const embedData = JSON.parse(jsonString);
      const embed = new EmbedBuilder(embedData);

      await message.channel.send({ embeds: [embed] });
      message.delete().catch(() => {});
    } catch (error) {
      message.reply('❌ Invalid JSON! Example: `{"title":"Test","description":"Hello","color":5814783}`');
    }
  },
};
