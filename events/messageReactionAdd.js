const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user, client) {
    if (user.bot) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        return;
      }
    }

    if (client.config.starboard.enabled && 
        reaction.emoji.name === client.config.starboard.emoji && 
        reaction.count >= client.config.starboard.threshold) {
      
      const starboardChannel = reaction.message.guild.channels.cache.get(client.config.starboard.channel);
      
      if (starboardChannel && reaction.message.channel.id !== starboardChannel.id) {
        const messages = await starboardChannel.messages.fetch({ limit: 100 });
        const existingMessage = messages.find(m => 
          m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.startsWith(reaction.message.id)
        );

        if (!existingMessage) {
          const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setAuthor({ name: reaction.message.author.tag, iconURL: reaction.message.author.displayAvatarURL() })
            .setDescription(reaction.message.content || '*[No text content]*')
            .addFields(
              { name: 'Channel', value: `${reaction.message.channel}`, inline: true },
              { name: 'Stars', value: `${reaction.count} ⭐`, inline: true }
            )
            .setFooter({ text: `${reaction.message.id} | ${new Date(reaction.message.createdTimestamp).toLocaleString()}` })
            .setTimestamp();

          if (reaction.message.attachments.size > 0) {
            embed.setImage(reaction.message.attachments.first().url);
          }

          await starboardChannel.send({ embeds: [embed] });
        }
      }
    }

    const roleId = await client.db.getReactionRole(reaction.message.id, reaction.emoji.name);
    if (!roleId) return;

    try {
      const member = await reaction.message.guild.members.fetch(user.id);
      const role = reaction.message.guild.roles.cache.get(roleId);
      
      if (role && member) {
        await member.roles.add(role);
      }
    } catch (error) {
      console.error('Error adding reaction role:', error);
    }
  },
};
