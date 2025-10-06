const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'quest',
  aliases: ['quests', 'daily', 'weekly'],
  description: 'View and complete daily/weekly quests for rewards',
  usage: '[claim]',
  async execute(message, args, client) {
    const action = args[0]?.toLowerCase();

    if (action === 'claim') {
      const questType = args[1]?.toLowerCase();
      
      if (!questType || !['daily', 'weekly'].includes(questType)) {
        return message.reply('❌ Usage: `quest claim <daily|weekly>`');
      }

      const canClaim = await client.db.canClaimQuest(message.author.id, questType);
      
      if (!canClaim) {
        const nextClaim = await client.db.getNextQuestClaim(message.author.id, questType);
        return message.reply(`❌ You've already claimed your ${questType} quest! Next claim: <t:${nextClaim}:R>`);
      }

      const reward = questType === 'daily' ? 1000 : 7500;
      await client.db.addMoney(message.guild.id, message.author.id, reward);
      await client.db.markQuestClaimed(message.author.id, questType);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎁 Quest Completed!')
        .setDescription(`You've claimed your **${questType}** quest reward!\n\n**Reward:** 💰 ${reward} coins`)
        .setFooter({ text: `Come back ${questType === 'daily' ? 'tomorrow' : 'next week'}!`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    }

    const dailyClaim = await client.db.getNextQuestClaim(message.author.id, 'daily');
    const weeklyClaim = await client.db.getNextQuestClaim(message.author.id, 'weekly');
    const canClaimDaily = await client.db.canClaimQuest(message.author.id, 'daily');
    const canClaimWeekly = await client.db.canClaimQuest(message.author.id, 'weekly');

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor)
      .setTitle('📋 Available Quests')
      .setDescription('Complete quests to earn rewards!')
      .addFields(
        { 
          name: '📅 Daily Quest', 
          value: `**Reward:** 💰 1,000 coins\n**Status:** ${canClaimDaily ? '✅ Available' : `⏰ Next: <t:${dailyClaim}:R>`}`, 
          inline: true 
        },
        { 
          name: '📆 Weekly Quest', 
          value: `**Reward:** 💰 7,500 coins\n**Status:** ${canClaimWeekly ? '✅ Available' : `⏰ Next: <t:${weeklyClaim}:R>`}`, 
          inline: true 
        }
      )
      .setFooter({ text: 'Use !quest claim <daily|weekly> to claim rewards', iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
