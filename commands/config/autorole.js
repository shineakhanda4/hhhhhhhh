const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'autorole',
  description: 'Manage auto-assigned roles for new members',
  usage: 'autorole <add|remove|list> [role]',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return message.reply('❌ You need `Manage Roles` permission to use this command!');
    }
    
    const action = args[0]?.toLowerCase();
    
    if (action === 'list') {
      const autoRoles = await client.db.getAutoRoles(message.guild.id);
      
      if (autoRoles.length === 0) {
        return message.reply('No auto-roles configured!');
      }
      
      const roles = autoRoles.map(roleId => `<@&${roleId}>`).join('\n');
      
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle('📋 Auto-Roles')
        .setDescription(roles)
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const role = message.mentions.roles.first();
    
    if (!role) {
      return message.reply('❌ Please mention a role!');
    }
    
    if (action === 'add') {
      await client.db.addAutoRole(message.guild.id, role.id);
      message.reply(`✅ Added ${role} to auto-roles! New members will automatically receive this role.`);
    } else if (action === 'remove') {
      await client.db.removeAutoRole(message.guild.id, role.id);
      message.reply(`✅ Removed ${role} from auto-roles!`);
    } else {
      message.reply('❌ Usage: `autorole <add|remove|list> [role]`');
    }
  },
};
