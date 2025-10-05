const { PermissionsBitField } = require('discord.js');

const userSpam = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    if (!message.guild) {
      return;
    }

    client.db.trackEvent(message.guild.id, 'messagesSent');

    const afkUser = client.db.getAFK(message.author.id);
    if (afkUser) {
      client.db.removeAFK(message.author.id);
      message.reply(`Welcome back! Your AFK status has been removed.`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      }).catch(() => {});
    }

    message.mentions.users.forEach(user => {
      const afk = client.db.getAFK(user.id);
      if (afk) {
        message.reply(`${user.username} is currently AFK: ${afk.message}`).then(msg => {
          setTimeout(() => msg.delete().catch(() => {}), 5000);
        }).catch(() => {});
      }
    });

    if (client.config.automod.enabled && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      if (automodCheck(message, client)) {
        return;
      }
    }

    const prefix = client.config.prefix;
    if (!message.content.startsWith(prefix)) {
      checkTriggers(message, client);
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || 
                    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      const tag = client.db.getTag(message.guild.id, commandName);
      if (tag) {
        message.reply(tag.content);
        tag.uses++;
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
      client.db.trackEvent(message.guild.id, 'commandsUsed');
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('❌ There was an error executing that command!');
    }
  },
};

function automodCheck(message, client) {
  const config = client.config.automod;
  
  const content = message.content.toLowerCase();
  for (const word of config.profanityFilter) {
    if (content.includes(word)) {
      message.delete().catch(() => {});
      message.channel.send(`${message.author}, please watch your language!`).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 5000);
      });
      client.db.trackEvent(message.guild.id, 'moderationActions');
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
    client.db.trackEvent(message.guild.id, 'moderationActions');
    return true;
  }

  if (message.mentions.users.size > config.maxMentions) {
    message.delete().catch(() => {});
    message.channel.send(`${message.author}, please don't spam mentions!`).then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 5000);
    });
    client.db.trackEvent(message.guild.id, 'moderationActions');
    return true;
  }

  const upperCase = (message.content.match(/[A-Z]/g) || []).length;
  const total = message.content.length;
  if (total > 10 && (upperCase / total) * 100 > config.capsPercentage) {
    message.delete().catch(() => {});
    message.channel.send(`${message.author}, please don't use excessive caps!`).then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 5000);
    });
    client.db.trackEvent(message.guild.id, 'moderationActions');
    return true;
  }

  return false;
}

function checkTriggers(message, client) {
  const content = message.content.toLowerCase();
  for (const [key, value] of client.db.triggers) {
    if (key.startsWith(`${message.guild.id}-`)) {
      const trigger = key.split('-')[1];
      if (content.includes(trigger)) {
        message.reply(value.response);
        break;
      }
    }
  }
}
