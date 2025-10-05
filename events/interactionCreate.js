const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') {
        await handleTicketCreation(interaction, client);
      } else if (interaction.customId === 'close_ticket') {
        await handleTicketClose(interaction, client);
      } else if (interaction.customId.startsWith('role_')) {
        await handleRoleButton(interaction, client);
      } else if (interaction.customId.startsWith('blackjack_')) {
        await handleBlackjack(interaction, client);
      } else if (interaction.customId.startsWith('rps_')) {
        await handleRPS(interaction, client);
      }
    }
  },
};

async function handleTicketCreation(interaction, client) {
  try {
    const existingTicket = interaction.guild.channels.cache.find(
      c => c.name === `ticket-${interaction.user.username.toLowerCase()}` && c.type === ChannelType.GuildText
    );

    if (existingTicket) {
      return interaction.reply({ 
        content: `❌ You already have an open ticket: ${existingTicket}`, 
        ephemeral: true 
      });
    }

    await interaction.deferReply({ ephemeral: true });

    let category = interaction.guild.channels.cache.find(
      c => c.name === client.config.ticket.categoryName && c.type === ChannelType.GuildCategory
    );
    
    if (!category) {
      category = await interaction.guild.channels.create({
        name: client.config.ticket.categoryName,
        type: ChannelType.GuildCategory,
      });
    }

    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel, 
            PermissionsBitField.Flags.SendMessages, 
            PermissionsBitField.Flags.ReadMessageHistory
          ],
        },
        {
          id: client.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel, 
            PermissionsBitField.Flags.SendMessages, 
            PermissionsBitField.Flags.ManageChannels
          ],
        },
      ],
    });

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🎫 Support Ticket')
      .setDescription(`Welcome ${interaction.user}!\n\nThank you for creating a ticket. Please describe your issue and a staff member will be with you shortly.\n\nTo close this ticket, use the button below or type \`!ticket close\`.`)
      .setFooter({ text: `Ticket created by ${interaction.user.tag}` })
      .setTimestamp();

    await ticketChannel.send({ 
      content: `${interaction.user}`, 
      embeds: [embed]
    });
    
    await client.db.createTicket(ticketChannel.id, {
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      reason: 'Created via button',
    });

    await interaction.editReply({ 
      content: `✅ Ticket created! ${ticketChannel}` 
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    
    if (interaction.deferred) {
      await interaction.editReply({ 
        content: '❌ Failed to create ticket. Please contact an administrator.' 
      });
    } else {
      await interaction.reply({ 
        content: '❌ Failed to create ticket. Please contact an administrator.', 
        ephemeral: true 
      });
    }
  }
}

async function handleTicketClose(interaction, client) {
  const ticket = await client.db.getTicket(interaction.channel.id);
  
  if (!ticket) {
    return interaction.reply({ 
      content: '❌ This is not a ticket channel!', 
      ephemeral: true 
    });
  }

  try {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🎫 Ticket Closed')
      .setDescription(`Ticket closed by ${interaction.user}\n\nThis channel will be deleted in 5 seconds.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    
    setTimeout(async () => {
      await client.db.closeTicket(interaction.channel.id);
      await interaction.channel.delete();
    }, 5000);
  } catch (error) {
    console.error('Error closing ticket:', error);
    await interaction.reply({ 
      content: '❌ Failed to close ticket!', 
      ephemeral: true 
    });
  }
}

async function handleRoleButton(interaction, client) {
  const roleId = interaction.customId.replace('role_', '');
  const role = interaction.guild.roles.cache.get(roleId);

  if (!role) {
    return interaction.reply({ 
      content: '❌ Role not found!', 
      ephemeral: true 
    });
  }

  try {
    if (interaction.member.roles.cache.has(roleId)) {
      await interaction.member.roles.remove(role);
      return interaction.reply({ 
        content: `✅ Removed the ${role.name} role!`, 
        ephemeral: true 
      });
    } else {
      await interaction.member.roles.add(role);
      return interaction.reply({ 
        content: `✅ Added the ${role.name} role!`, 
        ephemeral: true 
      });
    }
  } catch (error) {
    console.error('Error managing role:', error);
    return interaction.reply({ 
      content: '❌ Failed to manage role!', 
      ephemeral: true 
    });
  }
}

async function handleBlackjack(interaction, client) {
  const blackjackCommand = client.commands.get('blackjack');
  const game = blackjackCommand.activeGames.get(interaction.user.id);

  if (!game) {
    return interaction.reply({ 
      content: '❌ You don\'t have an active game!', 
      ephemeral: true 
    });
  }

  const action = interaction.customId.replace('blackjack_', '');

  try {
    if (action === 'hit') {
      const newCard = blackjackCommand.drawCard(game.deck);
      game.playerHand.push(newCard);

      const playerValue = blackjackCommand.calculateHand(game.playerHand);

      if (playerValue > 21) {
        const embed = blackjackCommand.createGameEmbed(interaction.user, game.playerHand, game.dealerHand, true);
        embed.setDescription('**You busted! Dealer wins!** 💥');
        embed.setColor('#FF0000');

        await interaction.update({ embeds: [embed], components: [blackjackCommand.createButtons(true)] });
        blackjackCommand.activeGames.delete(interaction.user.id);
      } else {
        const embed = blackjackCommand.createGameEmbed(interaction.user, game.playerHand, game.dealerHand, false);
        await interaction.update({ embeds: [embed] });
      }
    } else if (action === 'stand') {
      let dealerValue = blackjackCommand.calculateHand(game.dealerHand);

      while (dealerValue < 17) {
        const newCard = blackjackCommand.drawCard(game.deck);
        game.dealerHand.push(newCard);
        dealerValue = blackjackCommand.calculateHand(game.dealerHand);
      }

      const playerValue = blackjackCommand.calculateHand(game.playerHand);
      const embed = blackjackCommand.createGameEmbed(interaction.user, game.playerHand, game.dealerHand, true);

      if (dealerValue > 21 || playerValue > dealerValue) {
        embed.setDescription('**You win!** 🎉');
        embed.setColor('#00FF00');
      } else if (dealerValue === playerValue) {
        embed.setDescription('**Push! It\'s a tie!** 🤝');
        embed.setColor('#FFA500');
      } else {
        embed.setDescription('**Dealer wins!** 💔');
        embed.setColor('#FF0000');
      }

      await interaction.update({ embeds: [embed], components: [blackjackCommand.createButtons(true)] });
      blackjackCommand.activeGames.delete(interaction.user.id);
    }
  } catch (error) {
    console.error('Error handling blackjack:', error);
    await interaction.reply({ 
      content: '❌ An error occurred!', 
      ephemeral: true 
    });
  }
}

async function handleRPS(interaction, client) {
  const rpsCommand = client.commands.get('rps');
  const game = rpsCommand.activeGames.get(interaction.user.id);

  if (!game) {
    return interaction.reply({ 
      content: '❌ You don\'t have an active game!', 
      ephemeral: true 
    });
  }

  const choices = ['rock', 'paper', 'scissors'];
  const playerChoice = interaction.customId.replace('rps_', '');
  const botChoice = choices[Math.floor(Math.random() * choices.length)];

  const emojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
  };

  let result;
  if (playerChoice === botChoice) {
    result = 'It\'s a tie!';
    color = '#FFA500';
  } else if (
    (playerChoice === 'rock' && botChoice === 'scissors') ||
    (playerChoice === 'paper' && botChoice === 'rock') ||
    (playerChoice === 'scissors' && botChoice === 'paper')
  ) {
    result = 'You win!';
    color = '#00FF00';
  } else {
    result = 'You lose!';
    color = '#FF0000';
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle('🪨📄✂️ Rock Paper Scissors')
    .setDescription(`**${result}**\n\nYou chose: ${emojis[playerChoice]} ${playerChoice}\nI chose: ${emojis[botChoice]} ${botChoice}`)
    .setFooter({ text: `Game by ${interaction.user.username}` })
    .setTimestamp();

  await interaction.update({ embeds: [embed], components: [] });
  rpsCommand.activeGames.delete(interaction.user.id);
}
