const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'accountage',
  aliases: ['accage', 'account'],
  description: 'Check how old a Discord account is',
  usage: 'accountage [@user]',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    
    const createdAt = user.createdAt;
    const now = new Date();
    const ageMs = now - createdAt;
    
    const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;
    
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setTitle('📅 Account Age')
      .addFields(
        { name: 'Created', value: `<t:${Math.floor(createdAt.getTime() / 1000)}:F>`, inline: false },
        { name: 'Age', value: `${years} years, ${months} months, ${remainingDays} days`, inline: false }
      )
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  },
};
