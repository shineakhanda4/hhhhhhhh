const { EmbedBuilder, AuditLogEvent } = require('discord.js');

const kickTracking = new Map();

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {
    await client.db.trackEvent(member.guild.id, 'membersLeft');

    if (client.config.antinuke.enabled) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const fetchedLogs = await member.guild.fetchAuditLogs({
          limit: 1,
          type: AuditLogEvent.MemberKick,
        });

        const kickLog = fetchedLogs.entries.first();
        
        if (kickLog && kickLog.target.id === member.id && Date.now() - kickLog.createdTimestamp < 5000) {
          const { executor } = kickLog;
          
          if (executor && executor.id !== client.user.id && executor.id !== member.guild.ownerId) {
            const isWhitelisted = await client.db.isWhitelisted(member.guild.id, executor.id);
            
            if (!isWhitelisted) {
              if (!kickTracking.has(executor.id)) {
                kickTracking.set(executor.id, []);
              }

              const timestamps = kickTracking.get(executor.id);
              const now = Date.now();
              timestamps.push(now);

              const recentKicks = timestamps.filter(t => now - t < client.config.antinuke.timeWindow);
              kickTracking.set(executor.id, recentKicks);

              if (recentKicks.length > client.config.antinuke.maxKicks) {
                const executorMember = await member.guild.members.fetch(executor.id).catch(() => null);
                if (executorMember) {
                  const botMember = await member.guild.members.fetch(client.user.id);
                  if (executorMember.roles.highest.position < botMember.roles.highest.position) {
                    await executorMember.roles.set([]).catch(() => {});
                    
                    const owner = await member.guild.fetchOwner();
                    if (owner) {
                      owner.send(`🚨 **Anti-Nuke Alert**\n\n**${executor.tag}** (${executor.id}) exceeded the maximum kick limit and has been stripped of all roles.\n\nKicked ${recentKicks.length} members within ${client.config.antinuke.timeWindow / 1000} seconds.`).catch(() => {});
                    }

                    kickTracking.delete(executor.id);
                    console.log(`[ANTI-NUKE] Punished ${executor.tag} for mass kicking`);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Anti-nuke kick check error:', error);
      }
    }

    if (!client.config.logging.enabled || !client.config.logging.logChannel) return;

    try {
      const logChannel = member.guild.channels.cache.get(client.config.logging.logChannel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Member Left')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
          { name: 'Member Count', value: member.guild.memberCount.toString(), inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging member leave:', error);
    }
  },
};
