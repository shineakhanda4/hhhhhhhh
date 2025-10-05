const { EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    await client.db.trackEvent(member.guild.id, 'membersJoined');

    if (client.config.antinuke.enabled && member.user.bot) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const fetchedLogs = await member.guild.fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.BotAdd,
        });

        const botAddLog = fetchedLogs.entries.first();
        
        if (botAddLog && botAddLog.target.id === member.id && Date.now() - botAddLog.createdTimestamp < 5000) {
          const { executor } = botAddLog;
          
          if (executor && executor.id !== client.user.id && executor.id !== member.guild.ownerId) {
            const isWhitelisted = await client.db.isWhitelisted(member.guild.id, executor.id);
            
            if (!isWhitelisted) {
              await member.kick('Unauthorized bot addition - Anti-Nuke Protection').catch(() => {});
              
              const executorMember = await member.guild.members.fetch(executor.id).catch(() => null);
              if (executorMember) {
                const botMember = await member.guild.members.fetch(client.user.id);
                if (executorMember.roles.highest.position < botMember.roles.highest.position) {
                  await executorMember.roles.set([]).catch(() => {});
                  
                  const owner = await member.guild.fetchOwner();
                  if (owner) {
                    owner.send(`🚨 **Anti-Nuke Alert**\n\n**${executor.tag}** (${executor.id}) attempted to add an unauthorized bot **${member.user.tag}** and has been stripped of all roles.\n\nThe bot has been removed from the server.`).catch(() => {});
                  }

                  console.log(`[ANTI-NUKE] Punished ${executor.tag} for unauthorized bot addition`);
                }
              }
              return;
            }
          }
        }
      } catch (error) {
        console.error('Anti-nuke bot add check error:', error);
      }
    }

    if (client.config.welcome.enabled && client.config.welcome.channel) {
      try {
        const welcomeChannel = member.guild.channels.cache.get(client.config.welcome.channel);
        if (welcomeChannel) {
          const welcomeMsg = client.config.welcome.message
            .replace('{user}', `${member.user}`)
            .replace('{username}', member.user.username)
            .replace('{server}', member.guild.name)
            .replace('{membercount}', member.guild.memberCount);

          const welcomeEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('👋 Welcome!')
            .setDescription(welcomeMsg)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: `Member #${member.guild.memberCount}` })
            .setTimestamp();

          await welcomeChannel.send({ embeds: [welcomeEmbed] });
        }
      } catch (error) {
        console.error('Error sending welcome message:', error);
      }
    }

    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = member.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Member Joined')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Member Count', value: member.guild.memberCount.toString(), inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging member join:', error);
    }
  },
};
