const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Display all commands',
  aliases: ['commands', 'h'],
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📚 Bot Commands - 75+ Commands!')
      .setDescription('Prefix: `' + client.config.prefix + '` | Features from Carl-bot, Falcon bot & OwO bot!')
      .addFields(
        { 
          name: '👮 Moderation', 
          value: '`kick`, `ban`, `unban`, `mute`, `unmute`, `warn`, `warnings`, `clearwarnings`, `purge`, `lockdown`, `slowmode`',
          inline: false 
        },
        { 
          name: '🎫 Ticket System', 
          value: '`ticket create`, `ticket close`, `ticket add`, `ticket remove`, `ticket setup` (button panel)',
          inline: false 
        },
        { 
          name: '💬 Custom Commands & Autoresponders', 
          value: '`tag create`, `tag delete`, `tag list`, `tag info`, `trigger create`, `trigger delete`\n`autoresponder add/remove/list/toggle` (regex, wildcards)',
          inline: false 
        },
        { 
          name: '💡 Suggestions', 
          value: '`suggest`, `suggestion approve`, `suggestion deny`',
          inline: false 
        },
        { 
          name: '🎭 Roles', 
          value: '`role add`, `role remove`, `reactionrole`, `buttonrole`, `autorole add/remove/list`',
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
          name: '🛠️ Utility & Tools', 
          value: '`remind`, `afk`, `note`, `serverinfo`, `userinfo`, `avatar`, `poll`\n`serverstats`, `pins`, `autopin`, `vcstats`, `backup create/list`',
          inline: false 
        },
        { 
          name: '🎮 Fun & Games', 
          value: '`8ball`, `roll`, `trivia`, `joke`, `blackjack`, `rps`, `meme`, `dog`, `cat`',
          inline: false 
        },
        { 
          name: '🎰 Gambling (OwO-inspired)', 
          value: '`slots`, `roulette`, `coinflip` (bet money and win big!)',
          inline: false 
        },
        { 
          name: '💰 Economy System', 
          value: '`balance`, `daily`, `give`, `trade`\n`quest` (daily/weekly rewards), `hunt` (catch animals)',
          inline: false 
        },
        { 
          name: '🦁 Animals & Pets', 
          value: '`hunt`, `zoo`, `petname`, `battle` (PvP with bets)',
          inline: false 
        },
        { 
          name: '💕 Social & Marriage', 
          value: '`marry`, `accept`, `decline`, `divorce`, `hug`, `kiss`, `pat`, `cuddle`, `slap`, `bite`, `poke`, `boop`, `cookie`, `ship`',
          inline: false 
        },
        { 
          name: '📊 Levels & Stats', 
          value: '`rank`, `leaderboard`, `invites`, `messages`, `vcstats`',
          inline: false 
        },
        { 
          name: '📈 Analytics', 
          value: '`analytics`, `stats`, `serverstats`',
          inline: false 
        },
        { 
          name: '⚙️ Configuration', 
          value: '`setlog`, `setprefix`, `automod`, `welcome`, `starboard`',
          inline: false 
        },
        { 
          name: '🛡️ Anti-Nuke Protection', 
          value: '`antinuke enable`, `antinuke disable`, `antinuke status`, `antinuke whitelist`, `antinuke list`',
          inline: false 
        }
      )
      .setFooter({ text: 'Use !help <command> for details | 21+ database tables | Advanced logging system' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
