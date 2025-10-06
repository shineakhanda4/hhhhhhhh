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

### ✅ Advanced Logging System (Carl-bot inspired)
- Member join/leave tracking
- Message deletion and editing logging
- Role updates and changes tracking
- Nickname changes logging
- Voice channel activity (join/leave/switch)
- Channel creation, updates, and deletion
- Role creation, updates, and deletion
- Ban/unban event logging
- Voice state changes (mute/deafen)
- Configurable log channel

### ✅ Custom Commands & Autoresponders (Carl-bot inspired)
- Tag system (create, delete, list, info)
- Trigger system for auto-responses
- **Advanced autoresponder system** with multiple match types:
  - Exact match
  - Contains (substring)
  - Starts with
  - Ends with
  - Regex pattern matching
- Toggle autoresponders on/off
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
- **Server statistics** with detailed analytics
- User info, avatar commands
- Poll creation
- **Message pinning system** (view all pins, pin count)
- **Auto-pin threshold** (auto-pin messages with X reactions)
- **Voice statistics** per user (total time, sessions, favorite channel)
- **Backup/restore system** for server settings and configurations

### ✅ Fun Commands & Games
- 8ball, dice roll, coin flip
- Trivia game
- Joke command
- **Blackjack game** with interactive buttons
- **Rock-paper-scissors** game
- **Meme, dog, cat** image commands
- **Slots machine** (10x+ multipliers)
- **Roulette** (bet on red/black or specific numbers, 35x on direct hits)
- **Coinflip betting** (double your money)

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
- **Quest system** with daily (1,000 coins) and weekly (7,500 coins) rewards
- Balance tracking (wallet & bank)
- **Trading system** for money and items
- Give/transfer commands with button confirmation
- Server-based economy (separate balance per server)

### ✅ Animal Collection & Zoo (OwO-bot inspired)
- **Enhanced hunt system** with 14 unique animals
- 5 rarity tiers: Common, Uncommon, Rare, Epic, Legendary
- Build your zoo collection with value-based rewards
- **Pet naming system** (name and rename your animals)
- Animal tracking and display
- Rarity system (6 tiers)
- Animal tracking and display

### ✅ Battle & RPG System (OwO-bot inspired)
- **PvP battle arena** with dynamic power calculations
- Bet money on battles
- Power-based combat system
- Winner takes all the wagered coins
- Real-time battle results with embeds

### ✅ Gambling Games (OwO-bot inspired)
- Slots machine (10x jackpot)
- Coinflip betting
- Lottery system
- Blackjack (existing)

### ✅ Social & Action Commands (OwO-bot inspired)
- **Marriage system** with button-based proposals (propose, accept, decline, divorce)
- Marriage proposal system with notifications
- Action commands: hug, kiss, pat, cuddle, slap, bite, poke, boop, cookie
- Ship calculator
- Animated GIF reactions
- Partner status tracking

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
- **21+ total database tables** including all new features
- Data survives bot restarts and deployments
- Automatic database initialization on startup
- New tables: autoresponders, quest_claims, marriage_proposals, voice_sessions, guild_config, backups, guild_economy

## Recent Changes (October 6, 2025) - MASSIVE UPDATE!

### 👑 Admin System & Economy Management (Just Added!)
- ✅ **Bot Admin System** - Dedicated admin role separate from Discord permissions
- ✅ **Add/Remove Admins** - `addadmin`, `removeadmin`, `listadmins` commands
- ✅ **Economy Management Commands** (Admin only):
  - `addmoney` - Give coins to any user
  - `removemoney` - Take coins from any user
  - `setbalance` - Set exact balance for any user
  - `reseteconomy` - Reset all server economy data with confirmation
- ✅ **Persistent Admin Storage** - Admins saved to database and loaded on startup
- ✅ **Admin by Username** - Add admins by @mention, user ID, or exact username

### 🚀 Latest Additions - Carl-bot, Falcon bot & OwO bot Features
- ✅ **Advanced Logging System Expansion** - Added 8 new event handlers:
  - guildMemberUpdate (nickname & role changes)
  - voiceStateUpdate (join/leave/switch channels)
  - channelCreate/channelUpdate
  - roleCreate/roleUpdate
  - messageUpdate (message edits)
  - guildBanRemove (unban logging)
- ✅ **Advanced Autoresponder System** - Regex patterns, wildcard matching, exact/contains/starts/ends with triggers
- ✅ **Quest System** - Daily & weekly quests with 1,000 and 7,500 coin rewards
- ✅ **Enhanced Gambling** - Slots machine (25x jackpot), Roulette (35x on number hits), improved coinflip
- ✅ **Trading System** - Trade money and items between users with button confirmation
- ✅ **Voice Statistics** - Track voice time, sessions, and favorite channels per user
- ✅ **Message Pinning Tools** - View all pins, auto-pin threshold system
- ✅ **Server Statistics Dashboard** - Comprehensive analytics with member counts, channel counts, activity metrics
- ✅ **Backup/Restore System** - Save and restore server configurations, roles, and channels
- ✅ **Pet Naming System** - Name and rename your collected animals
- ✅ **PvP Battle Arena** - Battle other users with money wagering
- ✅ **Enhanced Marriage System** - Proposal tracking, accept/decline commands added
- ✅ **Server-based Economy** - Separate balance tracking per server
- ✅ **8 New Database Tables** - autoresponders, quest_claims, marriage_proposals, voice_sessions, guild_config, backups, guild_economy, and enhanced tables
- Total of **75+ commands** across 15+ categories now available!

## Previous Changes (October 2025)
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
