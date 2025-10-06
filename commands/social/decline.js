const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'decline',
  description: 'Decline a marriage proposal',
  usage: '<user_id>',
  async execute(message, args, client) {
    const proposerId = args[0];

    if (!proposerId) {
      return message.reply('❌ Please provide the user ID! Usage: `decline <user_id>`');
    }

    const proposal = await client.db.getProposal(proposerId, message.author.id);

    if (!proposal) {
      return message.reply('❌ You don\'t have a pending proposal from this user!');
    }

    await client.db.deleteProposal(proposerId, message.author.id);

    const proposer = await client.users.fetch(proposerId);

    message.reply(`💔 ${message.author} has declined ${proposer}'s marriage proposal.`);
  },
};
