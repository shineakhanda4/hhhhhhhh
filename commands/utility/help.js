const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Display all commands',
  aliases: ['commands', 'h'],
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📚 Bot Commands')
      .setDescription('Prefix: `' + client.config.prefix + '`')
      .addFields(
        { 
          name: '👮 Moderation', 
          value: '`kick`, `ban`, `unban`, `mute`, `unmute`, `warn`, `warnings`, `clearwarnings`, `purge`',
          inline: false 
        },
        { 
          name: '🎫 Ticket System', 
          value: '`ticket create`, `ticket close`, `ticket add`, `ticket remove`',
          inline: false 
        },
        { 
          name: '💬 Custom Commands', 
          value: '`tag create`, `tag delete`, `tag list`, `tag info`, `trigger create`, `trigger delete`',
          inline: false 
        },
        { 
          name: '💡 Suggestions', 
          value: '`suggest`, `suggestion approve`, `suggestion deny`',
          inline: false 
        },
        { 
          name: '🎭 Roles', 
          value: '`role add`, `role remove`, `reactionrole`',
          inline: false 
        },
        { 
          name: '📢 Embeds', 
          value: '`embed`, `announce`',
          inline: false 
        },
        { 
          name: '🎉 Giveaways', 
          value: '`giveaway start`, `giveaway end`, `giveaway reroll`',
          inline: false 
        },
        { 
          name: '🧵 Threads', 
          value: '`thread create`, `thread archive`, `thread lock`, `thread delete`',
          inline: false 
        },
        { 
          name: '🛠️ Utility', 
          value: '`remind`, `afk`, `note`, `serverinfo`, `userinfo`, `avatar`, `poll`',
          inline: false 
        },
        { 
          name: '🎮 Fun', 
          value: '`8ball`, `roll`, `coinflip`, `trivia`, `joke`',
          inline: false 
        },
        { 
          name: '📊 Analytics (Unique)', 
          value: '`analytics`, `stats`',
          inline: false 
        },
        { 
          name: '⚙️ Configuration', 
          value: '`setlog`, `setprefix`, `automod`',
          inline: false 
        },
        { 
          name: '🛡️ Anti-Nuke Protection', 
          value: '`antinuke enable`, `antinuke disable`, `antinuke status`, `antinuke whitelist`, `antinuke list`',
          inline: false 
        }
      )
      .setFooter({ text: 'Use !help <command> for detailed information' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
