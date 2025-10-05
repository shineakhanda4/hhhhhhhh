const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'giveaway',
  description: 'Giveaway commands',
  usage: '<start|end|reroll> [parameters]',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!action) {
      return message.reply('❌ Usage: `giveaway <start|end|reroll>`');
    }

    switch (action) {
      case 'start':
        await startGiveaway(message, args.slice(1), client);
        break;
      case 'end':
        await endGiveaway(message, args.slice(1), client);
        break;
      case 'reroll':
        await rerollGiveaway(message, args.slice(1), client);
        break;
      default:
        message.reply('❌ Invalid action! Use: start, end, reroll');
    }
  },
};

async function startGiveaway(message, args, client) {
  const duration = parseInt(args[0]);
  const winners = parseInt(args[1]);
  const prize = args.slice(2).join(' ');

  if (!duration || !winners || !prize) {
    return message.reply('❌ Usage: `giveaway start <duration_minutes> <winners> <prize>`');
  }

  const endTime = Date.now() + (duration * 60 * 1000);

  const embed = new EmbedBuilder()
    .setColor('#FF69B4')
    .setTitle('🎉 GIVEAWAY 🎉')
    .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endTime / 1000)}:R>`)
    .setFooter({ text: 'React with 🎉 to enter!' })
    .setTimestamp(endTime);

  const giveawayMsg = await message.channel.send({ embeds: [embed] });
  await giveawayMsg.react('🎉');

  await client.db.createGiveaway(giveawayMsg.id, {
    guildId: message.guild.id,
    prize,
    winners,
    endTime,
    channelId: message.channel.id,
    messageId: giveawayMsg.id,
    emoji: '🎉',
  });

  message.delete().catch(() => {});
}

async function endGiveaway(message, args, client) {
  const messageId = args[0];
  
  if (!messageId) {
    return message.reply('❌ Usage: `giveaway end <message_id>`');
  }

  const giveaway = await client.db.getGiveaway(messageId);
  
  if (!giveaway) {
    return message.reply('❌ Giveaway not found!');
  }

  try {
    const channel = await message.client.channels.fetch(giveaway.channelId);
    const giveawayMsg = await channel.messages.fetch(messageId);
    
    const reactions = giveawayMsg.reactions.cache.get(giveaway.emoji);
    const users = await reactions.users.fetch();
    const participants = users.filter(u => !u.bot);
    
    if (participants.size === 0) {
      return message.reply('❌ No valid participants!');
    }

    const winners = [];
    const participantArray = Array.from(participants.values());
    
    for (let i = 0; i < Math.min(giveaway.winners, participantArray.length); i++) {
      const randomIndex = Math.floor(Math.random() * participantArray.length);
      winners.push(participantArray.splice(randomIndex, 1)[0]);
    }

    const winnerMentions = winners.map(w => `<@${w.id}>`).join(', ');
    await giveawayMsg.reply(`🎉 Congratulations ${winnerMentions}! You won: **${giveaway.prize}**`);
    
    await client.db.endGiveaway(messageId);
    message.reply('✅ Giveaway ended!');
  } catch (error) {
    console.error(error);
    message.reply('❌ Failed to end giveaway!');
  }
}

async function rerollGiveaway(message, args, client) {
  message.reply('🎲 Reroll feature coming soon!');
}
