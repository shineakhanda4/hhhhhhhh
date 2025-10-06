const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Display all commands or get detailed info about a specific command',
  aliases: ['commands', 'h', 'cmds'],
  async execute(message, args, client) {
    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const command = client.commands.get(commandName) || 
                      Array.from(client.commands.values()).find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      
      if (!command) {
        return message.reply(`❌ Command \`${commandName}\` not found!`);
      }

      const detailEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`📖 Command: ${command.name}`)
        .setDescription(command.description || 'No description available')
        .addFields(
          { name: 'Aliases', value: command.aliases ? command.aliases.map(a => `\`${a}\``).join(', ') : 'None', inline: true },
          { name: 'Usage', value: command.usage || `\`${client.config.prefix}${command.name}\``, inline: true }
        )
        .setTimestamp();

      return message.reply({ embeds: [detailEmbed] });
    }

    const totalCommands = client.commands.size;
    
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🔥 R.O.T.I. Bot - Complete Command List 🔥')
      .setDescription(`**Prefix:** \`${client.config.prefix}\`\n**Total Commands:** ${totalCommands}+ | **Categories:** 18 | **PostgreSQL Database**\n\n*Use \`${client.config.prefix}help <command>\` for detailed info*`)
      .addFields(
        { 
          name: '👮 Moderation (11 Commands)', 
          value: '`kick` `ban` `unban` `mute` `unmute` `warn` `warnings` `clearwarnings` `purge` `lockdown` `slowmode`',
          inline: false 
        },
        { 
          name: '🎫 Ticket System (5 Commands)', 
          value: '`ticket create` `ticket close` `ticket add` `ticket remove` `ticket setup`\n*Button panel support for easy ticket creation*',
          inline: false 
        },
        { 
          name: '💬 Custom Commands & Autoresponders (10 Commands)', 
          value: '`tag create` `tag delete` `tag list` `tag info` `tag edit` `trigger create` `trigger delete` `trigger list`\n`autoresponder add` `autoresponder remove` `autoresponder list` `autoresponder toggle`\n*Supports regex, wildcards, exact match, contains, starts/ends with*',
          inline: false 
        },
        { 
          name: '💡 Suggestion System (3 Commands)', 
          value: '`suggest` `suggestion approve` `suggestion deny`\n*Community voting with upvote/downvote reactions*',
          inline: false 
        },
        { 
          name: '🎭 Role Management (8 Commands)', 
          value: '`role add` `role remove` `role info` `role list` `reactionrole` `buttonrole` `autorole add` `autorole remove` `autorole list`\n*Interactive button roles & reaction roles*',
          inline: false 
        },
        { 
          name: '📢 Embeds & Announcements (2 Commands)', 
          value: '`embed` `announce`\n*Create beautiful custom embeds with JSON*',
          inline: false 
        },
        { 
          name: '🎉 Giveaway System (4 Commands)', 
          value: '`giveaway start` `giveaway end` `giveaway reroll` `giveaway list`\n*Multiple winners, automatic selection, reaction-based*',
          inline: false 
        },
        { 
          name: '🧵 Thread Management (4 Commands)', 
          value: '`thread create` `thread archive` `thread lock` `thread delete`\n*Full thread control with permissions*',
          inline: false 
        },
        { 
          name: '🛠️ Utility & Tools (15 Commands)', 
          value: '`remind` `afk` `note` `serverinfo` `userinfo` `avatar` `poll` `choose` `accountage`\n`serverstats` `pins` `autopin` `vcstats` `backup create` `backup list` `backup load`\n*Advanced analytics, voice stats tracking, server backups*',
          inline: false 
        },
        { 
          name: '🎮 Fun & Games (10 Commands)', 
          value: '`8ball` `roll` `trivia` `joke` `blackjack` `rps` `meme` `dog` `cat` `fortune`\n*Interactive games with betting support*',
          inline: false 
        },
        { 
          name: '🎰 Casino Games (4 Commands)', 
          value: '`slots` `roulette` `coinflip` `lottery`\n*Bet Cowoncy and win big! House edge applies*',
          inline: false 
        },
        { 
          name: '💰 Economy System (10 Commands)', 
          value: '`balance` `daily` `give` `trade` `quest` `work` `rob` `deposit` `withdraw` `pay`\n*Complete economy with daily/weekly quests, trading system*',
          inline: false 
        },
        { 
          name: '🦁 Animals & Pets (4 Commands)', 
          value: '`hunt` `zoo` `petname` `battle`\n*Catch animals, build your zoo, battle other players for money!*',
          inline: false 
        },
        { 
          name: '💕 Social & Marriage (15 Commands)', 
          value: '`marry` `accept` `decline` `divorce` `hug` `kiss` `pat` `cuddle` `slap` `bite` `poke` `boop` `cookie` `ship` `communism`\n*Relationship system with fun interaction commands*',
          inline: false 
        },
        { 
          name: '📊 Levels & Rankings (5 Commands)', 
          value: '`rank` `leaderboard` `levels` `invites` `messages`\n*XP system with customizable level rewards*',
          inline: false 
        },
        { 
          name: '📈 Analytics & Statistics (4 Commands)', 
          value: '`analytics` `stats` `serverstats` `vcstats`\n*Detailed server analytics, activity tracking, voice statistics*',
          inline: false 
        },
        { 
          name: '⚙️ Server Configuration (8 Commands)', 
          value: '`setlog` `setprefix` `automod` `welcome` `starboard` `config` `settings` `setup`\n*Full server customization: welcome messages, logging, auto-moderation*',
          inline: false 
        },
        { 
          name: '👑 Bot Admin Commands (5 Commands)', 
          value: '`addadmin` `removeadmin` `listadmins` `addmoney` `removemoney` `setbalance` `reseteconomy`\n*Manage bot admins & economy (bot owner only)*',
          inline: false 
        },
        { 
          name: '🛡️ Anti-Nuke Protection (5 Commands)', 
          value: '`antinuke enable` `antinuke disable` `antinuke status` `antinuke whitelist` `antinuke unwhitelist` `antinuke list`\n*Protect your server from mass bans, channel deletion, role changes*',
          inline: false 
        },
        { 
          name: '🎨 Meme Generators (10+ Templates)', 
          value: '`drake` `distractedbf` `changemymind` `thinking` `ExpandingBrain` and more!\n*Create custom memes with text overlays*',
          inline: false 
        }
      )
      .setFooter({ 
        text: `⚡ Advanced Features: Auto-moderation • Logging • XP System • Economy • Marriage • Anti-Nuke • Database-Backed` 
      })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('📊 Server Stats')
          .setCustomId('stats_button')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setLabel('⚙️ Configuration')
          .setCustomId('config_button')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel('🎮 Games')
          .setCustomId('games_button')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setLabel('💰 Economy')
          .setCustomId('economy_button')
          .setStyle(ButtonStyle.Success)
      );

    message.reply({ embeds: [embed], components: [row] });
  },
};
