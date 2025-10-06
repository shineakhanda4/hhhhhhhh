const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'petname',
  aliases: ['namepet', 'renamepet'],
  description: 'Name or rename one of your animals',
  usage: '<animal_id> <name>',
  async execute(message, args, client) {
    const animalId = parseInt(args[0]);
    const petName = args.slice(1).join(' ');

    if (!animalId || !petName) {
      return message.reply('❌ Usage: `petname <animal_id> <name>`');
    }

    if (petName.length > 32) {
      return message.reply('❌ Pet name must be 32 characters or less!');
    }

    await client.db.setPetName(message.author.id, animalId, petName);

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Pet Named!')
      .setDescription(`Your pet has been named **${petName}**!`)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
