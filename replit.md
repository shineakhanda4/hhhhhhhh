# Discord Bot - R.O.T.I Clone with Advanced Features

## Overview
A comprehensive Discord bot inspired by R.O.T.I with all core features plus unique AI-powered enhancements. Built with Discord.js v14 and Node.js.

## Features Implemented

### ✅ Moderation System
- Kick, ban, unban, mute, unmute commands
- Warning system with tracking
- Message purge/clear
- Automated moderation (spam, profanity, caps, mention spam)

### ✅ Ticket System
- Create, close, add, remove users from tickets
- Automatic category creation
- Permission-based access control

### ✅ Logging System
- Member join/leave tracking
- Message deletion logging
- Configurable log channel

### ✅ Custom Commands
- Tag system (create, delete, list, info)
- Trigger system for auto-responses
- Usage tracking

### ✅ Suggestion System
- User suggestions with voting
- Approve/deny workflow
- Status tracking

### ✅ Role Management
- Add/remove roles
- Reaction roles system
- Self-role capabilities

### ✅ Embeds & Announcements
- Custom embed creator with JSON
- Announcement system

### ✅ Giveaway System
- Start, end giveaways
- Multiple winners support
- Automatic winner selection

### ✅ Thread Management
- Create, archive, lock, delete threads
- Permission-based controls

### ✅ Utility Commands
- Reminders with scheduled notifications
- AFK status system
- User notes for moderation
- Server info, user info, avatar
- Poll creation

### ✅ Fun Commands
- 8ball, dice roll, coin flip
- Trivia game
- Joke command

### ✅ Analytics (Unique Feature)
- Server activity tracking
- Real-time metrics dashboard
- Activity score calculation

### ✅ Configuration
- Customizable prefix
- Log channel setup
- Automod configuration

## Project Structure
```
├── index.js                 # Main bot file
├── config/
│   └── botConfig.js        # Bot configuration
├── database/
│   └── storage.js          # In-memory data storage
├── events/
│   ├── ready.js            # Bot ready event
│   ├── messageCreate.js    # Message handling & automod
│   ├── guildMemberAdd.js   # Member join logging
│   ├── guildMemberRemove.js # Member leave logging
│   ├── messageDelete.js    # Message deletion logging
│   ├── messageReactionAdd.js   # Reaction role handling
│   └── messageReactionRemove.js
└── commands/
    ├── moderation/         # Moderation commands
    ├── ticket/             # Ticket system
    ├── utility/            # Utility commands
    ├── tags/               # Tag & trigger system
    ├── suggestion/         # Suggestion system
    ├── roles/              # Role management
    ├── embed/              # Embed creator
    ├── giveaway/           # Giveaway system
    ├── thread/             # Thread management
    ├── fun/                # Fun commands
    ├── analytics/          # Analytics dashboard
    └── config/             # Configuration commands
```

## Setup Instructions
1. Get Discord bot token from Discord Developer Portal
2. Create .env file with: DISCORD_TOKEN=your_token_here
3. Invite bot to server with proper permissions
4. Run the bot

## Default Configuration
- Prefix: `r!`
- Automod: Enabled
- Color: Discord Blurple (#5865F2)

## Recent Changes
- Created complete bot infrastructure with all R.O.T.I features
- Implemented unique analytics dashboard feature
- Added comprehensive event handling system
- Built modular command structure for easy expansion
