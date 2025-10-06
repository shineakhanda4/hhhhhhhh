const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const categoryEmojis = {
  moderation: '👮',
  ticket: '🎫',
  tags: '💬',
  suggestion: '💡',
  roles: '🎭',
  embed: '📢',
  giveaway: '🎉',
  thread: '🧵',
  utility: '🛠️',
  fun: '🎮',
  economy: '💰',
  social: '💕',
  levels: '📊',
  leaderboard: '🏆',
  invites: '📬',
  analytics: '📈',
  config: '⚙️',
  memes: '🎨',
  antinuke: '🛡️'
};

const categoryDescriptions = {
  moderation: 'Server moderation and management',
  ticket: 'Support ticket system',
  tags: 'Custom commands & autoresponders',
  suggestion: 'Community suggestion system',
  roles: 'Role management and assignment',
  embed: 'Embeds & announcements',
  giveaway: 'Giveaway system',
  thread: 'Thread management',
  utility: 'Utility & tools',
  fun: 'Fun commands & games',
  economy: 'Economy & currency system',
  social: 'Social & interaction commands',
  levels: 'Leveling & XP system',
  leaderboard: 'Rankings & leaderboards',
  invites: 'Invite tracking',
  analytics: 'Server analytics & statistics',
  config: 'Bot configuration',
  memes: 'Meme generators',
  antinuke: 'Anti-nuke protection'
};

function getCommandsByCategory(client) {
  const categories = {};
  
  for (const [name, command] of client.commands) {
    const category = command.category || 'utility';
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(command);
  }
  
  return categories;
}

function createCategoryEmbed(client, categories, page = 0) {
  const categoryEntries = Object.entries(categories).sort((a, b) => a[0].localeCompare(b[0]));
  const totalPages = Math.ceil(categoryEntries.length / 6);
  const startIdx = page * 6;
  const endIdx = Math.min(startIdx + 6, categoryEntries.length);
  const pageCategories = categoryEntries.slice(startIdx, endIdx);
  
  const totalCommands = client.commands.size;
  const totalCategories = categoryEntries.length;
  
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🔥 R.O.T.I. Bot - Complete Command List 🔥')
    .setDescription(
      `**Prefix:** \`${client.config.prefix}\`\n` +
      `**Total Commands:** ${totalCommands} | **Categories:** ${totalCategories}\n\n` +
      `*Use \`${client.config.prefix}help <command>\` for detailed info*\n` +
      `*Use \`${client.config.prefix}help <category>\` to see category commands*`
    )
    .setFooter({ 
      text: `⚡ Page ${page + 1}/${totalPages} | Database-Backed | Auto-Moderation | Advanced Logging` 
    })
    .setTimestamp();

  for (const [categoryName, commands] of pageCategories) {
    const emoji = categoryEmojis[categoryName] || '📁';
    const desc = categoryDescriptions[categoryName] || 'Commands';
    const commandList = commands.slice(0, 10).map(cmd => `\`${cmd.name}\``).join(' ');
    const more = commands.length > 10 ? ` +${commands.length - 10} more` : '';
    
    embed.addFields({
      name: `${emoji} ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} (${commands.length})`,
      value: `${commandList}${more}\n*${desc}*`,
      inline: false
    });
  }
  
  return embed;
}

function createCategoryDetailEmbed(client, categoryName, commands) {
  const emoji = categoryEmojis[categoryName] || '📁';
  const desc = categoryDescriptions[categoryName] || 'Commands';
  
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(`${emoji} ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Commands`)
    .setDescription(`**${desc}**\n\nTotal: ${commands.length} commands\n\nUse \`${client.config.prefix}help <command>\` for detailed info`)
    .setTimestamp();

  const sortedCommands = commands.sort((a, b) => a.name.localeCompare(b.name));

  for (const cmd of sortedCommands) {
    const aliases = cmd.aliases && cmd.aliases.length > 0 
      ? ` (${cmd.aliases.map(a => `\`${a}\``).join(', ')})` 
      : '';
    const description = cmd.description || 'No description';
    embed.addFields({
      name: `${client.config.prefix}${cmd.name}${aliases}`,
      value: description,
      inline: false
    });
  }
  
  return embed;
}

function createNavigationButtons(page, totalPages) {
  const row = new ActionRowBuilder();
  
  row.addComponents(
    new ButtonBuilder()
      .setCustomId('help_first')
      .setLabel('⏮️ First')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 0),
    new ButtonBuilder()
      .setCustomId('help_prev')
      .setLabel('◀️ Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 0),
    new ButtonBuilder()
      .setCustomId('help_next')
      .setLabel('Next ▶️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page >= totalPages - 1),
    new ButtonBuilder()
      .setCustomId('help_last')
      .setLabel('Last ⏭️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page >= totalPages - 1)
  );
  
  return row;
}

module.exports = {
  name: 'help',
  description: 'Display all commands or get detailed info about a specific command/category',
  aliases: ['commands', 'h', 'cmds'],
  usage: '[command|category]',
  async execute(message, args, client) {
    const categories = getCommandsByCategory(client);
    
    if (args.length > 0) {
      const query = args[0].toLowerCase();
      
      const command = client.commands.get(query) || 
                      Array.from(client.commands.values()).find(cmd => 
                        cmd.aliases && cmd.aliases.includes(query)
                      );
      
      if (command) {
        const detailEmbed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle(`📖 Command: ${command.name}`)
          .setDescription(command.description || 'No description available')
          .setTimestamp();

        if (command.aliases && command.aliases.length > 0) {
          detailEmbed.addFields({
            name: 'Aliases',
            value: command.aliases.map(a => `\`${a}\``).join(', '),
            inline: true
          });
        }

        const usageText = command.usage 
          ? `\`${client.config.prefix}${command.name} ${command.usage}\``
          : `\`${client.config.prefix}${command.name}\``;
        
        detailEmbed.addFields({
          name: 'Usage',
          value: usageText,
          inline: false
        });

        if (command.permissions && command.permissions.length > 0) {
          detailEmbed.addFields({
            name: 'Required Permissions',
            value: command.permissions.map(p => `\`${p}\``).join(', '),
            inline: false
          });
        }

        if (command.category) {
          const emoji = categoryEmojis[command.category] || '📁';
          detailEmbed.addFields({
            name: 'Category',
            value: `${emoji} ${command.category.charAt(0).toUpperCase() + command.category.slice(1)}`,
            inline: true
          });
        }

        return message.reply({ embeds: [detailEmbed] });
      }
      
      if (categories[query]) {
        const categoryEmbed = createCategoryDetailEmbed(client, query, categories[query]);
        return message.reply({ embeds: [categoryEmbed] });
      }
      
      return message.reply(`❌ Command or category \`${query}\` not found! Use \`${client.config.prefix}help\` to see all commands.`);
    }

    const categoryEntries = Object.entries(categories);
    const totalPages = Math.ceil(categoryEntries.length / 6);
    const embed = createCategoryEmbed(client, categories, 0);
    const buttons = totalPages > 1 ? createNavigationButtons(0, totalPages) : null;
    
    const reply = await message.reply({ 
      embeds: [embed], 
      components: buttons ? [buttons] : [] 
    });

    if (totalPages <= 1) return;

    let currentPage = 0;

    const collector = reply.createMessageComponentCollector({
      time: 180000
    });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ 
          content: '❌ This is not your help menu!', 
          ephemeral: true 
        });
      }

      if (interaction.customId === 'help_first') {
        currentPage = 0;
      } else if (interaction.customId === 'help_prev') {
        currentPage = Math.max(0, currentPage - 1);
      } else if (interaction.customId === 'help_next') {
        currentPage = Math.min(totalPages - 1, currentPage + 1);
      } else if (interaction.customId === 'help_last') {
        currentPage = totalPages - 1;
      }

      const newEmbed = createCategoryEmbed(client, categories, currentPage);
      const newButtons = createNavigationButtons(currentPage, totalPages);
      
      await interaction.update({ 
        embeds: [newEmbed], 
        components: [newButtons] 
      });
    });

    collector.on('end', () => {
      const disabledButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('help_first_disabled')
            .setLabel('⏮️ First')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('help_prev_disabled')
            .setLabel('◀️ Previous')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('help_next_disabled')
            .setLabel('Next ▶️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('help_last_disabled')
            .setLabel('Last ⏭️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        );
      
      reply.edit({ components: [disabledButtons] }).catch(() => {});
    });
  },
};
