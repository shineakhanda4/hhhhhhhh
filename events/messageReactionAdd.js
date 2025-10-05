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

    const roleId = client.db.getReactionRole(reaction.message.id, reaction.emoji.name);
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
