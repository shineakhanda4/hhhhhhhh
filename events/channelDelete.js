const { AuditLogEvent, PermissionsBitField } = require('discord.js');

const channelDeleteTracking = new Map();

module.exports = {
  name: 'channelDelete',
  async execute(channel, client) {
    if (!client.config.antinuke.enabled) return;

    try {
      const fetchedLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete,
      });

      const deletionLog = fetchedLogs.entries.first();
      if (!deletionLog) return;

      const { executor } = deletionLog;
      if (!executor) return;

      if (executor.id === client.user.id) return;

      if (channel.guild.ownerId === executor.id) return;

      const isWhitelisted = await client.db.isWhitelisted(channel.guild.id, executor.id);
      if (isWhitelisted) return;

      if (!channelDeleteTracking.has(executor.id)) {
        channelDeleteTracking.set(executor.id, []);
      }

      const timestamps = channelDeleteTracking.get(executor.id);
      const now = Date.now();
      timestamps.push(now);

      const recentDeletes = timestamps.filter(t => now - t < client.config.antinuke.timeWindow);
      channelDeleteTracking.set(executor.id, recentDeletes);

      if (recentDeletes.length > client.config.antinuke.maxChannelDeletes) {
        const member = await channel.guild.members.fetch(executor.id).catch(() => null);
        if (!member) return;

        const botMember = await channel.guild.members.fetch(client.user.id);
        if (member.roles.highest.position >= botMember.roles.highest.position) return;

        await member.roles.set([]).catch(() => {});
        
        const owner = await channel.guild.fetchOwner();
        if (owner) {
          owner.send(`🚨 **Anti-Nuke Alert**\n\n**${executor.tag}** (${executor.id}) exceeded the maximum channel deletion limit and has been stripped of all roles.\n\nDeleted ${recentDeletes.length} channels within ${client.config.antinuke.timeWindow / 1000} seconds.`).catch(() => {});
        }

        channelDeleteTracking.delete(executor.id);
        
        console.log(`[ANTI-NUKE] Punished ${executor.tag} for mass channel deletion`);
      }
    } catch (error) {
      console.error('Anti-nuke channel delete error:', error);
    }
  },
};
