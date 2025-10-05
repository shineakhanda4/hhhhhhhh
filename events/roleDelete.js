const { AuditLogEvent, PermissionsBitField } = require('discord.js');

const roleDeleteTracking = new Map();

module.exports = {
  name: 'roleDelete',
  async execute(role, client) {
    if (!client.config.antinuke.enabled) return;

    try {
      const fetchedLogs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleDelete,
      });

      const deletionLog = fetchedLogs.entries.first();
      if (!deletionLog) return;

      const { executor } = deletionLog;
      if (!executor) return;

      if (executor.id === client.user.id) return;

      if (role.guild.ownerId === executor.id) return;

      const isWhitelisted = await client.db.isWhitelisted(role.guild.id, executor.id);
      if (isWhitelisted) return;

      if (!roleDeleteTracking.has(executor.id)) {
        roleDeleteTracking.set(executor.id, []);
      }

      const timestamps = roleDeleteTracking.get(executor.id);
      const now = Date.now();
      timestamps.push(now);

      const recentDeletes = timestamps.filter(t => now - t < client.config.antinuke.timeWindow);
      roleDeleteTracking.set(executor.id, recentDeletes);

      if (recentDeletes.length > client.config.antinuke.maxRoleDeletes) {
        const member = await role.guild.members.fetch(executor.id).catch(() => null);
        if (!member) return;

        const botMember = await role.guild.members.fetch(client.user.id);
        if (member.roles.highest.position >= botMember.roles.highest.position) return;

        await member.roles.set([]).catch(() => {});
        
        const owner = await role.guild.fetchOwner();
        if (owner) {
          owner.send(`🚨 **Anti-Nuke Alert**\n\n**${executor.tag}** (${executor.id}) exceeded the maximum role deletion limit and has been stripped of all roles.\n\nDeleted ${recentDeletes.length} roles within ${client.config.antinuke.timeWindow / 1000} seconds.`).catch(() => {});
        }

        roleDeleteTracking.delete(executor.id);
        
        console.log(`[ANTI-NUKE] Punished ${executor.tag} for mass role deletion`);
      }
    } catch (error) {
      console.error('Anti-nuke role delete error:', error);
    }
  },
};
