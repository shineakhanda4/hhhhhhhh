const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'note',
  description: 'Add or view notes for a user',
  usage: '<add|view> <@user> [note]',
  permissions: [PermissionsBitField.Flags.ModerateMembers],
  args: true,
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();
    
    if (action === 'add') {
      const member = message.mentions.members.first();
      if (!member) {
        return message.reply('❌ Please mention a member!');
      }

      const note = args.slice(2).join(' ');
      if (!note) {
        return message.reply('❌ Please provide a note!');
      }

      client.db.addNote(message.guild.id, member.id, note);
      message.reply(`✅ Note added for ${member.user.tag}`);
      
    } else if (action === 'view') {
      const member = message.mentions.members.first();
      if (!member) {
        return message.reply('❌ Please mention a member!');
      }

      const notes = client.db.getNotes(message.guild.id, member.id);
      
      if (notes.length === 0) {
        return message.reply('📝 No notes found for this member.');
      }

      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`📝 Notes for ${member.user.tag}`)
        .setDescription(notes.map((n, i) => 
          `**${i + 1}.** ${n.note}\n*<t:${Math.floor(n.timestamp / 1000)}:R>*`
        ).join('\n\n'))
        .setFooter({ text: `Total: ${notes.length} notes` });

      message.reply({ embeds: [embed] });
    } else {
      message.reply('❌ Usage: `note <add|view> <@user> [note]`');
    }
  },
};
