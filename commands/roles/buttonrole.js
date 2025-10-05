const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'buttonrole',
  description: 'Setup button-based role assignment',
  usage: '<title> <description> [@role1 Label1] [@role2 Label2] ...',
  permissions: [PermissionsBitField.Flags.ManageRoles],
  args: true,
  async execute(message, args, client) {
    if (args.length < 3) {
      return message.reply('❌ Usage: `!buttonrole <title> <description> [@role Label] [@role Label] ...`\n\nExample: `!buttonrole "Choose Roles" "Select your roles" @Member Member @VIP VIP`');
    }

    const roles = [];
    const roleMentions = message.mentions.roles;
    
    if (roleMentions.size === 0) {
      return message.reply('❌ Please mention at least one role!');
    }

    const title = args.shift();
    let description = '';
    const roleData = [];
    
    let i = 0;
    while (i < args.length) {
      if (args[i].startsWith('<@&')) {
        const roleId = args[i].match(/\d+/)[0];
        const role = message.guild.roles.cache.get(roleId);
        if (role && args[i + 1]) {
          roleData.push({ role, label: args[i + 1] });
          i += 2;
        } else {
          i++;
        }
      } else {
        description += args[i] + ' ';
        i++;
      }
    }

    if (roleData.length === 0) {
      return message.reply('❌ Please provide roles with labels! Example: `@Role Label`');
    }

    if (roleData.length > 5) {
      return message.reply('❌ Maximum 5 roles per button panel!');
    }

    try {
      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(title.replace(/"/g, ''))
        .setDescription(description.trim() || 'Click a button to get a role!')
        .setFooter({ text: 'Click buttons to toggle roles' })
        .setTimestamp();

      const buttons = roleData.map((data, index) => {
        return new ButtonBuilder()
          .setCustomId(`role_${data.role.id}`)
          .setLabel(data.label)
          .setStyle(ButtonStyle.Primary);
      });

      const rows = [];
      for (let i = 0; i < buttons.length; i += 5) {
        const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 5));
        rows.push(row);
      }

      await message.channel.send({ embeds: [embed], components: rows });
      message.reply('✅ Button role panel created successfully!');
    } catch (error) {
      console.error(error);
      message.reply('❌ Failed to create button role panel!');
    }
  },
};
