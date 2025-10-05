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

async function checkReminders(client) {
  try {
    const pendingReminders = await client.db.getPendingReminders();
    
    for (const reminder of pendingReminders) {
      try {
        const user = await client.users.fetch(reminder.userId);
        await user.send(`⏰ Reminder: ${reminder.message}`);
        await client.db.deleteReminder(reminder.id);
      } catch (error) {
        console.error('Error sending reminder:', error);
        await client.db.deleteReminder(reminder.id);
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

async function checkGiveaways(client) {
  try {
    const now = Date.now();
    const giveaways = await client.db.getAllActiveGiveaways();
    
    for (const giveaway of giveaways) {
      if (now >= giveaway.endTime) {
        await endGiveaway(client, giveaway);
      }
    }
  } catch (error) {
    console.error('Error checking giveaways:', error);
  }
}

async function endGiveaway(client, giveaway) {
  try {
    const channel = await client.channels.fetch(giveaway.channelId);
    const message = await channel.messages.fetch(giveaway.messageId);
    
    const reactions = message.reactions.cache.get(giveaway.emoji);
    if (!reactions) {
      await client.db.endGiveaway(giveaway.messageId);
      return;
    }

    const users = await reactions.users.fetch();
    const participants = users.filter(u => !u.bot);
    
    if (participants.size === 0) {
      await message.reply('No valid participants for this giveaway!');
      await client.db.endGiveaway(giveaway.messageId);
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
    
    await client.db.endGiveaway(giveaway.messageId);
  } catch (error) {
    console.error('Error ending giveaway:', error);
  }
}
