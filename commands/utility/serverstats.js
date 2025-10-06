const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverstats',
  aliases: ['stats', 'serverinfo'],
  description: 'View detailed server statistics and analytics',
  usage: '',
  async execute(message, args, client) {
    const guild = message.guild;

    const analytics = await client.db.getServerAnalytics(guild.id);
    
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;

    const onlineMembers = guild.members.cache.filter(m => m.presence?.status !== 'offline' && !m.user.bot).size;
    const totalMembers = guild.memberCount;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle(`📊 ${guild.name} Statistics`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { 
          name: '👥 Members', 
          value: `Total: ${totalMembers}\nOnline: ${onlineMembers}\nBots: ${botCount}`, 
          inline: true 
        },
        { 
          name: '📢 Channels', 
          value: `Text: ${textChannels}\nVoice: ${voiceChannels}\nCategories: ${categories}`, 
          inline: true 
        },
        { 
          name: '🎭 Roles', 
          value: `${guild.roles.cache.size} roles`, 
          inline: true 
        },
        { 
          name: '📅 Created', 
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, 
          inline: true 
        },
        { 
          name: '👑 Owner', 
          value: `<@${guild.ownerId}>`, 
          inline: true 
        },
        { 
          name: '🚀 Boost Level', 
          value: `Level ${guild.premiumTier}\n${guild.premiumSubscriptionCount || 0} boosts`, 
          inline: true 
        }
      );

    if (analytics) {
      embed.addFields(
        { 
          name: '📈 Activity (Last 7 Days)', 
          value: `Messages: ${analytics.messagesSent || 0}\nCommands: ${analytics.commandsUsed || 0}\nMembers Joined: ${analytics.membersJoined || 0}`, 
          inline: false 
        }
      );
    }

    embed.setFooter({ text: `Server ID: ${guild.id}` })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
