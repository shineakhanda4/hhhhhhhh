const { PermissionsBitField } = require('discord.js');

const userSpam = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    if (!message.guild) {
      return;
    }

    await client.db.trackEvent(message.guild.id, 'messagesSent');

    await client.db.incrementMessageCount(message.guild.id, message.author.id);

    const xpGain = Math.floor(Math.random() * 10) + 15;
    await client.db.addXP(message.guild.id, message.author.id, xpGain);

    const afkUser = await client.db.getAFK(message.author.id);
    if (afkUser) {
      await client.db.removeAFK(message.author.id);
      message.reply(`Welcome back! Your AFK status has been removed.`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      }).catch(() => {});
    }

    for (const user of message.mentions.users.values()) {
      const afk = await client.db.getAFK(user.id);
      if (afk) {
        message.reply(`${user.username} is currently AFK: ${afk.message}`).then(msg => {
          setTimeout(() => msg.delete().catch(() => {}), 5000);
        }).catch(() => {});
      }
    }

    if (client.config.automod.enabled && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      if (await automodCheck(message, client)) {
        return;
      }
    }

    const prefix = client.config.prefix;
    if (!message.content.startsWith(prefix)) {
      await checkTriggers(message, client);
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || 
                    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      const tag = await client.db.getTag(message.guild.id, commandName);
      if (tag) {
        message.reply(tag.content);
      }
      return;
    }

    if (command.permissions) {
      if (!message.member.permissions.has(command.permissions)) {
        return message.reply('❌ You do not have permission to use this command!');
      }
    }

    if (command.args && !args.length) {
      return message.reply(`❌ Usage: \`${prefix}${command.name} ${command.usage}\``);
    }

    try {
      await client.db.trackEvent(message.guild.id, 'commandsUsed');
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('❌ There was an error executing that command!');
    }
  },
};

async function automodCheck(message, client) {
  const config = client.config.automod;
  
  const content = message.content.toLowerCase();
  
  if (config.blockInvites) {
    const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+/gi;
    if (inviteRegex.test(message.content)) {
      message.delete().catch(() => {});
      message.channel.send(`${message.author}, Discord invites are not allowed!`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      });
      await client.db.trackEvent(message.guild.id, 'moderationActions');
      return true;
    }
  }

  if (config.blockLinks) {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = message.content.match(urlRegex);
    if (urls && urls.length > 0) {
      const isAllowed = urls.some(url => config.allowedLinks.some(allowed => url.includes(allowed)));
      if (!isAllowed) {
        message.delete().catch(() => {});
        message.channel.send(`${message.author}, links are not allowed in this channel!`).then(msg => {
          setTimeout(() => msg.delete().catch(() => {}), 5000);
        });
        await client.db.trackEvent(message.guild.id, 'moderationActions');
        return true;
      }
    }
  }

  for (const word of config.profanityFilter) {
    if (content.includes(word.toLowerCase())) {
      message.delete().catch(() => {});
      message.channel.send(`${message.author}, please watch your language!`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      });
      await client.db.trackEvent(message.guild.id, 'moderationActions');
      return true;
    }
  }

  const userId = message.author.id;
  if (!userSpam.has(userId)) {
    userSpam.set(userId, []);
  }
  
  const timestamps = userSpam.get(userId);
  const now = Date.now();
  timestamps.push(now);
  
  const recentMessages = timestamps.filter(t => now - t < config.spamTimeWindow);
  userSpam.set(userId, recentMessages);
  
  if (recentMessages.length > config.spamThreshold) {
    message.delete().catch(() => {});
    message.channel.send(`${message.author}, please slow down! (Anti-spam)`).then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 5000);
    });
    userSpam.set(userId, []);
    await client.db.trackEvent(message.guild.id, 'moderationActions');
    return true;
  }

  if (message.mentions.users.size > config.maxMentions) {
    message.delete().catch(() => {});
    message.channel.send(`${message.author}, please don't spam mentions!`).then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 5000);
    });
    await client.db.trackEvent(message.guild.id, 'moderationActions');
    return true;
  }

  const upperCase = (message.content.match(/[A-Z]/g) || []).length;
  const total = message.content.length;
  if (total > 10 && (upperCase / total) * 100 > config.capsPercentage) {
    message.delete().catch(() => {});
    message.channel.send(`${message.author}, please don't use excessive caps!`).then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 5000);
    });
    await client.db.trackEvent(message.guild.id, 'moderationActions');
    return true;
  }

  return false;
}

async function checkTriggers(message, client) {
  try {
    const triggers = await client.db.getTriggersForGuild(message.guild.id);
    const content = message.content.toLowerCase();
    
    for (const trigger of triggers) {
      if (content.includes(trigger.trigger.toLowerCase())) {
        message.reply(trigger.response);
        break;
      }
    }

    const autoresponders = await client.db.getAutoresponders(message.guild.id);
    const messageContent = message.content;
    
    for (const ar of autoresponders) {
      let matched = false;
      
      switch (ar.type) {
        case 'exact':
          matched = messageContent.toLowerCase() === ar.trigger.toLowerCase();
          break;
        case 'contains':
          matched = messageContent.toLowerCase().includes(ar.trigger.toLowerCase());
          break;
        case 'starts':
          matched = messageContent.toLowerCase().startsWith(ar.trigger.toLowerCase());
          break;
        case 'ends':
          matched = messageContent.toLowerCase().endsWith(ar.trigger.toLowerCase());
          break;
        case 'regex':
          try {
            const regex = new RegExp(ar.trigger, 'i');
            matched = regex.test(messageContent);
          } catch (error) {
            console.error('Invalid regex in autoresponder:', ar.trigger);
          }
          break;
      }
      
      if (matched) {
        message.reply(ar.response);
        break;
      }
    }
  } catch (error) {
    console.error('Error checking triggers:', error);
  }
}
