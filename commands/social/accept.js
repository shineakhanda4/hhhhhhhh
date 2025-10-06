const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'accept',
  description: 'Accept a marriage proposal',
  usage: '<user_id>',
  async execute(message, args, client) {
    const proposerId = args[0];

    if (!proposerId) {
      return message.reply('❌ Please provide the user ID! Usage: `accept <user_id>`');
    }

    const proposal = await client.db.getProposal(proposerId, message.author.id);

    if (!proposal) {
      return message.reply('❌ You don\'t have a pending proposal from this user!');
    }

    await client.db.createMarriage(proposerId, message.author.id);
    await client.db.deleteProposal(proposerId, message.author.id);

    const proposer = await client.users.fetch(proposerId);

    const embed = new EmbedBuilder()
      .setColor('#FF69B4')
      .setTitle('💕 Marriage')
      .setDescription(`${proposer} and ${message.author} are now married! Congratulations! 🎉`)
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
