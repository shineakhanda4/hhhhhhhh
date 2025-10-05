const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unban a user from the server',
  usage: '<user_id>',
  permissions: [PermissionsBitField.Flags.BanMembers],
  args: true,
  async execute(message, args, client) {
    const userId = args[0];
    
    try {
      await message.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Member Unbanned')
        .addFields(
          { name: 'User ID', value: userId, inline: true },
          { name: 'Moderator', value: `${message.author.tag}`, inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
      client.db.trackEvent(message.guild.id, 'moderationActions');
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to unban the user! Make sure they are banned and the ID is correct.');
    }
  },
};
