const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'backup',
  description: 'Create a backup of server settings',
  usage: 'create|list|load <id>',
  permissions: [PermissionsBitField.Flags.Administrator],
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!action || !['create', 'list', 'load'].includes(action)) {
      return message.reply('❌ Usage: `backup <create|list|load> [id]`');
    }

    if (action === 'create') {
      const backup = {
        guildId: message.guild.id,
        guildName: message.guild.name,
        roles: message.guild.roles.cache.map(r => ({
          name: r.name,
          color: r.color,
          permissions: r.permissions.bitfield.toString(),
          position: r.position,
          hoist: r.hoist,
          mentionable: r.mentionable
        })),
        channels: message.guild.channels.cache.map(c => ({
          name: c.name,
          type: c.type,
          position: c.position,
          topic: c.topic,
          nsfw: c.nsfw,
          parent: c.parent?.name
        })),
        config: {
          prefix: client.config.prefix,
          automod: client.config.automod,
          logging: client.config.logging,
          welcome: client.config.welcome
        },
        createdAt: Date.now()
      };

      const backupId = await client.db.createBackup(message.guild.id, backup);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Backup Created!')
        .setDescription(`Server backup created successfully!`)
        .addFields(
          { name: 'Backup ID', value: backupId, inline: true },
          { name: 'Roles Saved', value: `${backup.roles.length}`, inline: true },
          { name: 'Channels Saved', value: `${backup.channels.length}`, inline: true }
        )
        .setFooter({ text: 'Use !backup load <id> to restore' })
        .setTimestamp();

      message.reply({ embeds: [embed] });

    } else if (action === 'list') {
      const backups = await client.db.getBackups(message.guild.id);

      if (!backups || backups.length === 0) {
        return message.reply('❌ No backups found!');
      }

      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle('📦 Server Backups')
        .setDescription(backups.map((b, i) => 
          `**${i + 1}.** ID: \`${b.id}\`\nCreated: <t:${Math.floor(b.createdAt / 1000)}:R>`
        ).join('\n\n'))
        .setTimestamp();

      message.reply({ embeds: [embed] });

    } else if (action === 'load') {
      const backupId = args[1];
      
      if (!backupId) {
        return message.reply('❌ Please provide a backup ID! Use `backup list` to see available backups.');
      }

      message.reply('⚠️ **Warning:** Loading a backup will overwrite current server settings. This feature is intentionally limited to prevent accidental data loss. Contact server owner for manual restoration if needed.');
    }
  },
};
