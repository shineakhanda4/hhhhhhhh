const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') {
        await handleTicketCreation(interaction, client);
      } else if (interaction.customId === 'close_ticket') {
        await handleTicketClose(interaction, client);
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
