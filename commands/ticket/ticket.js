const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'ticket',
  description: 'Ticket system commands',
  usage: '<setup|create|close|add|remove>',
  async execute(message, args, client) {
    const subcommand = args[0]?.toLowerCase();

    if (!subcommand) {
      return message.reply('❌ Usage: `ticket <setup|create|close|add|remove>`');
    }

    switch (subcommand) {
      case 'setup':
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return message.reply('❌ You need Administrator permission to setup the ticket system!');
        }
        await setupTicketPanel(message, client);
        break;
      case 'create':
        await createTicket(message, args.slice(1), client);
        break;
      case 'close':
        await closeTicket(message, client);
        break;
      case 'add':
        await addToTicket(message, args.slice(1), client);
        break;
      case 'remove':
        await removeFromTicket(message, args.slice(1), client);
        break;
      default:
        message.reply('❌ Invalid subcommand! Use: setup, create, close, add, remove');
    }
  },
};

async function setupTicketPanel(message, client) {
  try {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🎫 Support Ticket System')
      .setDescription('Need help? Click the button below to create a support ticket!\n\nA staff member will assist you as soon as possible.')
      .addFields(
        { name: '📝 How it works', value: 'Click "Create Ticket" to open a private channel where you can describe your issue.' },
        { name: '⏱️ Response Time', value: 'Staff typically respond within a few hours.' }
      )
      .setFooter({ text: 'Click the button below to get started!' })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('Create Ticket')
      .setEmoji('🎫')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ embeds: [embed], components: [row] });
    message.reply('✅ Ticket panel has been set up successfully!');
  } catch (error) {
    console.error(error);
    message.reply('❌ Failed to setup ticket panel!');
  }
}

async function createTicket(message, args, client) {
  const reason = args.join(' ') || 'No reason provided';
  
  try {
    let category = message.guild.channels.cache.find(c => c.name === 'Tickets' && c.type === ChannelType.GuildCategory);
    
    if (!category) {
      category = await message.guild.channels.create({
        name: 'Tickets',
        type: ChannelType.GuildCategory,
      });
    }

    const ticketChannel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
        },
      ],
    });

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🎫 Ticket Created')
      .setDescription(`Welcome ${message.author}!\n\nReason: ${reason}\n\nA staff member will be with you shortly.`)
      .setTimestamp();

    await ticketChannel.send({ embeds: [embed] });
    
    await client.db.createTicket(ticketChannel.id, {
      guildId: message.guild.id,
      userId: message.author.id,
      reason,
      createdAt: Date.now(),
    });

    message.reply(`✅ Ticket created! ${ticketChannel}`);
  } catch (error) {
    console.error(error);
    message.reply('❌ Failed to create ticket!');
  }
}

async function closeTicket(message, client) {
  const ticket = await client.db.getTicket(message.channel.id);
  
  if (!ticket) {
    return message.reply('❌ This is not a ticket channel!');
  }

  try {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🎫 Ticket Closed')
      .setDescription(`Ticket closed by ${message.author}`)
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    
    setTimeout(async () => {
      await client.db.closeTicket(message.channel.id);
      await message.channel.delete();
    }, 5000);
  } catch (error) {
    console.error(error);
    message.reply('❌ Failed to close ticket!');
  }
}

async function addToTicket(message, args, client) {
  const ticket = await client.db.getTicket(message.channel.id);
  
  if (!ticket) {
    return message.reply('❌ This is not a ticket channel!');
  }

  const member = message.mentions.members.first();
  if (!member) {
    return message.reply('❌ Please mention a member to add!');
  }

  try {
    await message.channel.permissionOverwrites.create(member, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    message.reply(`✅ Added ${member} to the ticket!`);
  } catch (error) {
    console.error(error);
    message.reply('❌ Failed to add member!');
  }
}

async function removeFromTicket(message, args, client) {
  const ticket = await client.db.getTicket(message.channel.id);
  
  if (!ticket) {
    return message.reply('❌ This is not a ticket channel!');
  }

  const member = message.mentions.members.first();
  if (!member) {
    return message.reply('❌ Please mention a member to remove!');
  }

  try {
    await message.channel.permissionOverwrites.delete(member);
    message.reply(`✅ Removed ${member} from the ticket!`);
  } catch (error) {
    console.error(error);
    message.reply('❌ Failed to remove member!');
  }
}
