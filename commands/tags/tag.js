const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'tag',
  description: 'Custom tag commands',
  usage: '<create|delete|list|info> [name] [content]',
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (!action) {
      return message.reply('❌ Usage: `tag <create|delete|list|info> [name] [content]`');
    }

    switch (action) {
      case 'create':
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
          return message.reply('❌ You need Manage Messages permission!');
        }
        const name = args[1]?.toLowerCase();
        const content = args.slice(2).join(' ');
        
        if (!name || !content) {
          return message.reply('❌ Usage: `tag create <name> <content>`');
        }

        if (client.db.getTag(message.guild.id, name)) {
          return message.reply('❌ A tag with that name already exists!');
        }

        client.db.addTag(message.guild.id, name, content);
        message.reply(`✅ Tag \`${name}\` created!`);
        break;

      case 'delete':
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
          return message.reply('❌ You need Manage Messages permission!');
        }
        const tagName = args[1]?.toLowerCase();
        
        if (!tagName) {
          return message.reply('❌ Usage: `tag delete <name>`');
        }

        if (!client.db.getTag(message.guild.id, tagName)) {
          return message.reply('❌ Tag not found!');
        }

        client.db.deleteTag(message.guild.id, tagName);
        message.reply(`✅ Tag \`${tagName}\` deleted!`);
        break;

      case 'list':
        const tags = client.db.getAllTags(message.guild.id);
        
        if (tags.length === 0) {
          return message.reply('📝 No tags found!');
        }

        const embed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle('📝 Server Tags')
          .setDescription(tags.map(t => `\`${t.name}\` - Used ${t.uses} times`).join('\n'))
          .setFooter({ text: `Total: ${tags.length} tags` });

        message.reply({ embeds: [embed] });
        break;

      case 'info':
        const infoName = args[1]?.toLowerCase();
        
        if (!infoName) {
          return message.reply('❌ Usage: `tag info <name>`');
        }

        const tag = client.db.getTag(message.guild.id, infoName);
        
        if (!tag) {
          return message.reply('❌ Tag not found!');
        }

        const infoEmbed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle(`ℹ️ Tag: ${infoName}`)
          .addFields(
            { name: 'Content', value: tag.content, inline: false },
            { name: 'Uses', value: tag.uses.toString(), inline: true },
            { name: 'Created', value: `<t:${Math.floor(tag.createdAt / 1000)}:R>`, inline: true }
          );

        message.reply({ embeds: [infoEmbed] });
        break;

      default:
        message.reply('❌ Invalid action! Use: create, delete, list, info');
    }
  },
};
