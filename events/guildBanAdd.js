const { AuditLogEvent, PermissionsBitField } = require('discord.js');

const banTracking = new Map();

module.exports = {
  name: 'guildBanAdd',
  async execute(ban, client) {
    if (!client.config.antinuke.enabled) return;

    try {
      const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
      });

      const banLog = fetchedLogs.entries.first();
      if (!banLog) return;

      const { executor } = banLog;
      if (!executor) return;

      if (executor.id === client.user.id) return;

      if (ban.guild.ownerId === executor.id) return;

      const isWhitelisted = await client.db.isWhitelisted(ban.guild.id, executor.id);
      if (isWhitelisted) return;

      if (!banTracking.has(executor.id)) {
        banTracking.set(executor.id, []);
      }

      const timestamps = banTracking.get(executor.id);
      const now = Date.now();
      timestamps.push(now);

      const recentBans = timestamps.filter(t => now - t < client.config.antinuke.timeWindow);
      banTracking.set(executor.id, recentBans);

      if (recentBans.length > client.config.antinuke.maxBans) {
        const member = await ban.guild.members.fetch(executor.id).catch(() => null);
        if (!member) return;

        const botMember = await ban.guild.members.fetch(client.user.id);
        if (member.roles.highest.position >= botMember.roles.highest.position) return;

        await member.roles.set([]).catch(() => {});
        
        const owner = await ban.guild.fetchOwner();
        if (owner) {
          owner.send(`🚨 **Anti-Nuke Alert**\n\n**${executor.tag}** (${executor.id}) exceeded the maximum ban limit and has been stripped of all roles.\n\nBanned ${recentBans.length} members within ${client.config.antinuke.timeWindow / 1000} seconds.`).catch(() => {});
        }

        banTracking.delete(executor.id);
        
        console.log(`[ANTI-NUKE] Punished ${executor.tag} for mass banning`);
      }
    } catch (error) {
      console.error('Anti-nuke ban error:', error);
    }
  },
};
