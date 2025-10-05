const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'role',
  description: 'Manage user roles',
  usage: '<add|remove> <@user> <@role>',
  permissions: [PermissionsBitField.Flags.ManageRoles],
  args: true,
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!['add', 'remove'].includes(action)) {
      return message.reply('❌ Usage: `role <add|remove> <@user> <@role>`');
    }

    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member || !role) {
      return message.reply('❌ Please mention a valid member and role!');
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply('❌ I don\'t have permission to manage roles!');
    }

    if (message.guild.members.me.roles.highest.position <= role.position) {
      return message.reply('❌ I cannot manage this role (role hierarchy)!');
    }

    try {
      if (action === 'add') {
        await member.roles.add(role);
        message.reply(`✅ Added ${role} to ${member}!`);
      } else {
        await member.roles.remove(role);
        message.reply(`✅ Removed ${role} from ${member}!`);
      }
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to manage role!');
    }
  },
};
