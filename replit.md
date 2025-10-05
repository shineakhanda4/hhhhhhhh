# Discord Bot - R.O.T.I Clone with Advanced Features

## Overview
A comprehensive Discord bot inspired by R.O.T.I with all core features plus unique AI-powered enhancements. Built with Discord.js v14 and Node.js.

## Features Implemented

### ✅ Moderation System
- Kick, ban, unban, mute, unmute commands
- Warning system with tracking
- Message purge/clear
- Automated moderation (spam, profanity, caps, mention spam, invite blocking, link filtering)
- Lockdown and slowmode commands for channel control

### ✅ Ticket System
- Create, close, add, remove users from tickets
- Automatic category creation
- Permission-based access control
- **Button panel setup** for easy ticket creation

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
- **Button roles** for interactive role assignment

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

### ✅ Fun Commands & Games
- 8ball, dice roll, coin flip
- Trivia game
- Joke command
- **Blackjack game** with interactive buttons
- **Rock-paper-scissors** game
- **Meme, dog, cat** image commands

### ✅ Analytics (Unique Feature)
- Server activity tracking
- Real-time metrics dashboard
- Activity score calculation

### ✅ Configuration
- Customizable prefix
- Log channel setup
- Automod configuration (with invite/link filtering)
- **Welcome system** for new members
- **Starboard** to highlight popular messages

### ✅ Anti-Nuke Protection System
- Real-time malicious action detection
- Mass channel deletion protection
- Mass role deletion protection
- Mass ban/kick detection
- Unauthorized bot addition blocking
- Whitelist system for trusted users
- Automatic punishment (role removal)
- Owner notifications for security events

### ✅ Levels & XP System (Carl-bot inspired)
- Message-based XP gain
- Level progression system
- Rank command to check progress
- Server-wide leaderboard
- Automatic level tracking

### ✅ Auto-Roles & Sticky Roles (Carl-bot inspired)
- Automatic role assignment on join
- Sticky roles (re-assigned when users rejoin)
- Auto-role configuration commands
- Role persistence system

### ✅ Invite Tracking (Falcon-bot inspired)
- Track who invited each member
- Invite statistics per user
- Invite leaderboard
- Fake/left invite tracking

### ✅ Message Tracking & Leaderboards (Falcon-bot inspired)
- Message count tracking per user
- Live message leaderboards
- Voice time tracking
- Account age checker

### ✅ Economy System (OwO-bot inspired)
- Cowoncy currency system
- Daily rewards (100-150 Cowoncy)
- Balance tracking (wallet & bank)
- Give/transfer commands

### ✅ Animal Collection & Zoo (OwO-bot inspired)
- Hunt for animals (common to legendary)
- Build your zoo collection
- Rarity system (6 tiers)
- Animal tracking and display

### ✅ Battle & RPG System (OwO-bot inspired)
- Battle other users
- Bet Cowoncy on battles
- Animal-based power system
- Win/loss tracking

### ✅ Gambling Games (OwO-bot inspired)
- Slots machine (10x jackpot)
- Coinflip betting
- Lottery system
- Blackjack (existing)

### ✅ Social & Action Commands (OwO-bot inspired)
- Marriage system (propose, accept, divorce)
- Action commands: hug, kiss, pat, cuddle, slap, bite, poke, boop, cookie
- Ship calculator
- Animated GIF reactions

### ✅ Meme Generators (OwO-bot inspired)
- Drake meme generator
- Distracted boyfriend meme
- Communism meme
- Custom text memes

### ✅ Advanced Utilities
- Repeating messages system
- Drama channel (mod log overview)
- Account age checker
- Random choice picker

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
- Prefix: `!` (changed from `r!`)
- Automod: Enabled
- Anti-Nuke: Disabled by default (use `!antinuke enable` to activate)
- Color: Discord Blurple (#5865F2)

## Database
- Uses PostgreSQL for persistent data storage
- All moderation actions, tickets, tags, suggestions, giveaways, analytics, and anti-nuke whitelist are saved
- 13 total database tables including the new anti-nuke whitelist
- Data survives bot restarts and deployments
- Automatic database initialization on startup

## Recent Changes (October 2025)
- ✅ **Complete PostgreSQL migration** - All 13 database tables created and functional (warnings, mutes, tickets, tags, suggestions, giveaways, reminders, AFK, notes, reaction roles, analytics, triggers, anti-nuke whitelist)
- ✅ **Anti-Nuke Protection System Added** - Comprehensive server security against mass deletions, bans, kicks, and unauthorized bots
- ✅ **Command Prefix Changed** - Updated from `r!` to `!` for easier access
- ✅ **Enhanced Event Handlers** - Added 5 new anti-nuke event handlers (channelDelete, roleDelete, guildBanAdd, enhanced guildMemberAdd/Remove)
- ✅ **Ticket Setup with Buttons** - Added ticket setup command that creates an interactive button panel for easy ticket creation
- ✅ **Welcome System** - Automatic welcome messages for new members with customizable messages and placeholders
- ✅ **Starboard Feature** - Highlight popular messages with configurable star threshold and dedicated channel
- ✅ **Button Roles** - Interactive role assignment using buttons instead of reactions
- ✅ **Mini Games Added** - Blackjack and Rock-Paper-Scissors games with button-based interactions
- ✅ **Fun Commands** - Added meme, dog, and cat image commands using external APIs
- ✅ **Enhanced AutoMod** - Added Discord invite blocking and configurable link filtering
- ✅ **Channel Control** - Added lockdown and slowmode commands for better moderation
- ✅ **Updated Help Command** - Comprehensive command list including all new features
- ✅ **Fixed all async/await patterns** - Every database operation properly awaits results across all commands and events
- ✅ **Trigger system database integration** - Migrated triggers from in-memory Map to PostgreSQL with proper async handlers
- ✅ **Production deployment** - Bot successfully running as "CRICUIT MC#7282" with all systems operational
- All 60+ commands across 13 categories fully functional with persistent data storage
- Complete R.O.T.I feature parity achieved plus unique analytics dashboard, anti-nuke protection, and enhanced interactive features
