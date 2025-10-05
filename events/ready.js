const cron = require('node-cron');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    
    client.user.setActivity(`${client.config.prefix}help | Advanced Discord Bot`, { type: 'PLAYING' });

    cron.schedule('*/1 * * * *', () => {
      checkReminders(client);
      checkGiveaways(client);
    });

    console.log('✅ All systems operational!');
  },
};

function checkReminders(client) {
  const now = Date.now();
  for (const [userId, reminders] of client.db.reminders) {
    for (let i = reminders.length - 1; i >= 0; i--) {
      if (now >= reminders[i].time) {
        client.users.fetch(userId).then(user => {
          user.send(`⏰ Reminder: ${reminders[i].message}`).catch(() => {});
        }).catch(() => {});
        client.db.removeReminder(userId, i);
      }
    }
  }
}

function checkGiveaways(client) {
  const now = Date.now();
  const giveaways = client.db.getAllActiveGiveaways();
  
  for (const giveaway of giveaways) {
    if (now >= giveaway.endTime) {
      endGiveaway(client, giveaway);
    }
  }
}

async function endGiveaway(client, giveaway) {
  try {
    const channel = await client.channels.fetch(giveaway.channelId);
    const message = await channel.messages.fetch(giveaway.messageId);
    
    const reactions = message.reactions.cache.get(giveaway.emoji);
    if (!reactions) {
      client.db.endGiveaway(giveaway.messageId);
      return;
    }

    const users = await reactions.users.fetch();
    const participants = users.filter(u => !u.bot);
    
    if (participants.size === 0) {
      await message.reply('No valid participants for this giveaway!');
      client.db.endGiveaway(giveaway.messageId);
      return;
    }

    const winners = [];
    const participantArray = Array.from(participants.values());
    
    for (let i = 0; i < Math.min(giveaway.winners, participantArray.length); i++) {
      const randomIndex = Math.floor(Math.random() * participantArray.length);
      winners.push(participantArray.splice(randomIndex, 1)[0]);
    }

    const winnerMentions = winners.map(w => `<@${w.id}>`).join(', ');
    await message.reply(`🎉 Congratulations ${winnerMentions}! You won: **${giveaway.prize}**`);
    
    client.db.endGiveaway(giveaway.messageId);
  } catch (error) {
    console.error('Error ending giveaway:', error);
  }
}
