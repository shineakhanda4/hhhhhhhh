const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS warnings (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        reason TEXT,
        moderator VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS mutes (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        duration INTEGER,
        reason TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(guild_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(255) UNIQUE NOT NULL,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        reason TEXT,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        uses INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(guild_id, name)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS suggestions (
        id SERIAL PRIMARY KEY,
        message_id VARCHAR(255) UNIQUE NOT NULL,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        channel_id VARCHAR(255) NOT NULL,
        suggestion TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS giveaways (
        id SERIAL PRIMARY KEY,
        message_id VARCHAR(255) UNIQUE NOT NULL,
        guild_id VARCHAR(255) NOT NULL,
        channel_id VARCHAR(255) NOT NULL,
        prize TEXT,
        winners INTEGER,
        end_time BIGINT,
        emoji VARCHAR(50) DEFAULT '🎉',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        message TEXT,
        remind_time BIGINT,
        channel_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS afk_status (
        user_id VARCHAR(255) PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reaction_roles (
        id SERIAL PRIMARY KEY,
        message_id VARCHAR(255) NOT NULL,
        emoji VARCHAR(255) NOT NULL,
        role_id VARCHAR(255) NOT NULL,
        UNIQUE(message_id, emoji)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        guild_id VARCHAR(255) PRIMARY KEY,
        messages_sent INTEGER DEFAULT 0,
        members_joined INTEGER DEFAULT 0,
        members_left INTEGER DEFAULT 0,
        commands_used INTEGER DEFAULT 0,
        moderation_actions INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS triggers (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        trigger VARCHAR(255) NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(guild_id, trigger)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS antinuke_whitelist (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(guild_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS levels (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        xp BIGINT DEFAULT 0,
        level INTEGER DEFAULT 0,
        messages INTEGER DEFAULT 0,
        UNIQUE(guild_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sticky_roles (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        roles TEXT NOT NULL,
        UNIQUE(guild_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS invites (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        inviter_id VARCHAR(255) NOT NULL,
        invited_id VARCHAR(255) NOT NULL,
        invite_code VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS invite_stats (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        total_invites INTEGER DEFAULT 0,
        left_invites INTEGER DEFAULT 0,
        fake_invites INTEGER DEFAULT 0,
        UNIQUE(guild_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS message_stats (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        message_count BIGINT DEFAULT 0,
        UNIQUE(guild_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS voice_stats (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        total_time BIGINT DEFAULT 0,
        UNIQUE(guild_id, user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS economy (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        balance BIGINT DEFAULT 0,
        bank BIGINT DEFAULT 0,
        daily_last BIGINT,
        UNIQUE(user_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        rarity VARCHAR(50) NOT NULL,
        count INTEGER DEFAULT 1,
        UNIQUE(user_id, name)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        animal_id INTEGER NOT NULL,
        nickname VARCHAR(255),
        level INTEGER DEFAULT 1,
        strength INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS marriages (
        id SERIAL PRIMARY KEY,
        user1_id VARCHAR(255) NOT NULL,
        user2_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user1_id, user2_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lootboxes (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        count INTEGER DEFAULT 1,
        UNIQUE(user_id, type)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS enhanced_reaction_roles (
        id SERIAL PRIMARY KEY,
        message_id VARCHAR(255) NOT NULL,
        mode VARCHAR(50) DEFAULT 'normal',
        max_roles INTEGER,
        required_roles TEXT,
        blacklisted_roles TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS auto_roles (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        role_id VARCHAR(255) NOT NULL,
        UNIQUE(guild_id, role_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS repeating_messages (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        channel_id VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        interval BIGINT NOT NULL,
        last_sent BIGINT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS autoresponders (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        trigger TEXT NOT NULL,
        response TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'exact',
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS quest_claims (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        quest_type VARCHAR(50) NOT NULL,
        claimed_at BIGINT NOT NULL,
        UNIQUE(user_id, quest_type)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS marriage_proposals (
        id SERIAL PRIMARY KEY,
        proposer_id VARCHAR(255) NOT NULL,
        target_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(proposer_id, target_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS voice_sessions (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        channel_name VARCHAR(255),
        duration BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS guild_config (
        guild_id VARCHAR(255) PRIMARY KEY,
        autopin_threshold INTEGER,
        autoresponders_enabled BOOLEAN DEFAULT true
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS backups (
        id VARCHAR(255) PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        backup_data JSONB NOT NULL,
        created_at BIGINT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS guild_economy (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        balance BIGINT DEFAULT 0,
        UNIQUE(guild_id, user_id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

const db = {
  async addWarning(guildId, userId, reason, moderator) {
    await pool.query(
      'INSERT INTO warnings(guild_id, user_id, reason, moderator) VALUES($1, $2, $3, $4)',
      [guildId, userId, reason, moderator]
    );
  },

  async getWarnings(guildId, userId) {
    const result = await pool.query(
      'SELECT * FROM warnings WHERE guild_id = $1 AND user_id = $2 ORDER BY created_at DESC',
      [guildId, userId]
    );
    return result.rows.map(row => ({
      reason: row.reason,
      moderator: row.moderator,
      timestamp: new Date(row.created_at).getTime(),
    }));
  },

  async clearWarnings(guildId, userId) {
    await pool.query(
      'DELETE FROM warnings WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
  },

  async addMute(guildId, userId, duration, reason) {
    await pool.query(
      `INSERT INTO mutes(guild_id, user_id, duration, reason) 
       VALUES($1, $2, $3, $4) 
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET duration = $3, reason = $4, created_at = NOW()`,
      [guildId, userId, duration, reason]
    );
  },

  async removeMute(guildId, userId) {
    await pool.query(
      'DELETE FROM mutes WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
  },

  async getMute(guildId, userId) {
    const result = await pool.query(
      'SELECT * FROM mutes WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      duration: row.duration,
      reason: row.reason,
      timestamp: new Date(row.created_at).getTime(),
    };
  },

  async createTicket(ticketId, data) {
    await pool.query(
      'INSERT INTO tickets(ticket_id, guild_id, user_id, reason) VALUES($1, $2, $3, $4)',
      [ticketId, data.guildId, data.userId, data.reason]
    );
  },

  async getTicket(ticketId) {
    const result = await pool.query(
      'SELECT * FROM tickets WHERE ticket_id = $1 AND status = $2',
      [ticketId, 'open']
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      userId: row.user_id,
      reason: row.reason,
      createdAt: new Date(row.created_at).getTime(),
    };
  },

  async closeTicket(ticketId) {
    await pool.query(
      'UPDATE tickets SET status = $1 WHERE ticket_id = $2',
      ['closed', ticketId]
    );
  },

  async addTag(guildId, name, content) {
    await pool.query(
      `INSERT INTO tags(guild_id, name, content) 
       VALUES($1, $2, $3) 
       ON CONFLICT (guild_id, name) 
       DO UPDATE SET content = $3`,
      [guildId, name, content]
    );
  },

  async getTag(guildId, name) {
    const result = await pool.query(
      'SELECT * FROM tags WHERE guild_id = $1 AND name = $2',
      [guildId, name]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    await pool.query('UPDATE tags SET uses = uses + 1 WHERE id = $1', [row.id]);
    return {
      content: row.content,
      uses: row.uses + 1,
      createdAt: new Date(row.created_at).getTime(),
    };
  },

  async deleteTag(guildId, name) {
    await pool.query(
      'DELETE FROM tags WHERE guild_id = $1 AND name = $2',
      [guildId, name]
    );
  },

  async getAllTags(guildId) {
    const result = await pool.query(
      'SELECT name, uses, created_at FROM tags WHERE guild_id = $1 ORDER BY uses DESC',
      [guildId]
    );
    return result.rows.map(row => ({
      name: row.name,
      uses: row.uses,
      createdAt: new Date(row.created_at).getTime(),
    }));
  },

  async addSuggestion(messageId, data) {
    await pool.query(
      'INSERT INTO suggestions(message_id, guild_id, user_id, channel_id, suggestion) VALUES($1, $2, $3, $4, $5)',
      [messageId, data.guildId, data.userId, data.channelId, data.suggestion]
    );
  },

  async getSuggestion(messageId) {
    const result = await pool.query(
      'SELECT * FROM suggestions WHERE message_id = $1',
      [messageId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      userId: row.user_id,
      suggestion: row.suggestion,
      status: row.status,
      channelId: row.channel_id,
    };
  },

  async updateSuggestion(messageId, status) {
    await pool.query(
      'UPDATE suggestions SET status = $1 WHERE message_id = $2',
      [status, messageId]
    );
  },

  async createGiveaway(messageId, data) {
    await pool.query(
      'INSERT INTO giveaways(message_id, guild_id, channel_id, prize, winners, end_time, emoji) VALUES($1, $2, $3, $4, $5, $6, $7)',
      [messageId, data.guildId, data.channelId, data.prize, data.winners, data.endTime, data.emoji]
    );
  },

  async getGiveaway(messageId) {
    const result = await pool.query(
      'SELECT * FROM giveaways WHERE message_id = $1 AND status = $2',
      [messageId, 'active']
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      prize: row.prize,
      winners: row.winners,
      endTime: row.end_time,
      channelId: row.channel_id,
      messageId: row.message_id,
      emoji: row.emoji,
    };
  },

  async endGiveaway(messageId) {
    await pool.query(
      'UPDATE giveaways SET status = $1 WHERE message_id = $2',
      ['ended', messageId]
    );
  },

  async getAllActiveGiveaways() {
    const result = await pool.query(
      'SELECT * FROM giveaways WHERE status = $1',
      ['active']
    );
    return result.rows.map(row => ({
      prize: row.prize,
      winners: row.winners,
      endTime: row.end_time,
      channelId: row.channel_id,
      messageId: row.message_id,
      emoji: row.emoji,
    }));
  },

  async addReminder(userId, data) {
    await pool.query(
      'INSERT INTO reminders(user_id, message, remind_time, channel_id) VALUES($1, $2, $3, $4)',
      [userId, data.message, data.time, data.channelId]
    );
  },

  async getUserReminders(userId) {
    const result = await pool.query(
      'SELECT * FROM reminders WHERE user_id = $1 AND remind_time > $2 ORDER BY remind_time',
      [userId, Date.now()]
    );
    return result.rows.map(row => ({
      message: row.message,
      time: row.remind_time,
      channelId: row.channel_id,
      id: row.id,
    }));
  },

  async removeReminder(userId, index) {
    const reminders = await this.getUserReminders(userId);
    if (reminders[index]) {
      await pool.query('DELETE FROM reminders WHERE id = $1', [reminders[index].id]);
    }
  },

  async getPendingReminders() {
    const result = await pool.query(
      'SELECT * FROM reminders WHERE remind_time <= $1',
      [Date.now()]
    );
    return result.rows.map(row => ({
      userId: row.user_id,
      message: row.message,
      id: row.id,
    }));
  },

  async deleteReminder(id) {
    await pool.query('DELETE FROM reminders WHERE id = $1', [id]);
  },

  async setAFK(userId, message) {
    await pool.query(
      `INSERT INTO afk_status(user_id, message) 
       VALUES($1, $2) 
       ON CONFLICT (user_id) 
       DO UPDATE SET message = $2, created_at = NOW()`,
      [userId, message]
    );
  },

  async getAFK(userId) {
    const result = await pool.query(
      'SELECT * FROM afk_status WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      message: row.message,
      timestamp: new Date(row.created_at).getTime(),
    };
  },

  async removeAFK(userId) {
    await pool.query('DELETE FROM afk_status WHERE user_id = $1', [userId]);
  },

  async addNote(guildId, userId, note) {
    await pool.query(
      'INSERT INTO notes(guild_id, user_id, note) VALUES($1, $2, $3)',
      [guildId, userId, note]
    );
  },

  async getNotes(guildId, userId) {
    const result = await pool.query(
      'SELECT * FROM notes WHERE guild_id = $1 AND user_id = $2 ORDER BY created_at DESC',
      [guildId, userId]
    );
    return result.rows.map(row => ({
      note: row.note,
      timestamp: new Date(row.created_at).getTime(),
    }));
  },

  async addReactionRole(messageId, emoji, roleId) {
    await pool.query(
      `INSERT INTO reaction_roles(message_id, emoji, role_id) 
       VALUES($1, $2, $3) 
       ON CONFLICT (message_id, emoji) 
       DO UPDATE SET role_id = $3`,
      [messageId, emoji, roleId]
    );
  },

  async getReactionRole(messageId, emoji) {
    const result = await pool.query(
      'SELECT role_id FROM reaction_roles WHERE message_id = $1 AND emoji = $2',
      [messageId, emoji]
    );
    return result.rows.length > 0 ? result.rows[0].role_id : null;
  },

  async trackEvent(guildId, eventType) {
    const columnMap = {
      messagesSent: 'messages_sent',
      membersJoined: 'members_joined',
      membersLeft: 'members_left',
      commandsUsed: 'commands_used',
      moderationActions: 'moderation_actions',
    };

    const column = columnMap[eventType];
    if (!column) return;

    await pool.query(
      `INSERT INTO analytics(guild_id, ${column}) 
       VALUES($1, 1) 
       ON CONFLICT (guild_id) 
       DO UPDATE SET ${column} = analytics.${column} + 1, updated_at = NOW()`,
      [guildId]
    );
  },

  async getAnalytics(guildId) {
    const result = await pool.query(
      'SELECT * FROM analytics WHERE guild_id = $1',
      [guildId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      messagesSent: row.messages_sent,
      membersJoined: row.members_joined,
      membersLeft: row.members_left,
      commandsUsed: row.commands_used,
      moderationActions: row.moderation_actions,
    };
  },

  async addTrigger(guildId, trigger, response) {
    await pool.query(
      `INSERT INTO triggers(guild_id, trigger, response) 
       VALUES($1, $2, $3) 
       ON CONFLICT (guild_id, trigger) 
       DO UPDATE SET response = $3`,
      [guildId, trigger, response]
    );
  },

  async deleteTrigger(guildId, trigger) {
    await pool.query(
      'DELETE FROM triggers WHERE guild_id = $1 AND trigger = $2',
      [guildId, trigger]
    );
  },

  async getTriggersForGuild(guildId) {
    const result = await pool.query(
      'SELECT trigger, response FROM triggers WHERE guild_id = $1',
      [guildId]
    );
    return result.rows;
  },

  async addToAntiNukeWhitelist(guildId, userId) {
    await pool.query(
      `INSERT INTO antinuke_whitelist(guild_id, user_id) 
       VALUES($1, $2) 
       ON CONFLICT (guild_id, user_id) 
       DO NOTHING`,
      [guildId, userId]
    );
  },

  async removeFromAntiNukeWhitelist(guildId, userId) {
    await pool.query(
      'DELETE FROM antinuke_whitelist WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
  },

  async isWhitelisted(guildId, userId) {
    const result = await pool.query(
      'SELECT * FROM antinuke_whitelist WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    return result.rows.length > 0;
  },

  async getWhitelistedUsers(guildId) {
    const result = await pool.query(
      'SELECT user_id FROM antinuke_whitelist WHERE guild_id = $1',
      [guildId]
    );
    return result.rows.map(row => row.user_id);
  },

  async addXP(guildId, userId, amount) {
    await pool.query(
      `INSERT INTO levels(guild_id, user_id, xp, messages) 
       VALUES($1, $2, $3, 1) 
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET xp = levels.xp + $3, messages = levels.messages + 1`,
      [guildId, userId, amount]
    );
  },

  async getUserLevel(guildId, userId) {
    const result = await pool.query(
      'SELECT * FROM levels WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    if (result.rows.length === 0) return { xp: 0, level: 0, messages: 0 };
    return result.rows[0];
  },

  async getTopLevels(guildId, limit = 10) {
    const result = await pool.query(
      'SELECT user_id, xp, level, messages FROM levels WHERE guild_id = $1 ORDER BY xp DESC LIMIT $2',
      [guildId, limit]
    );
    return result.rows;
  },

  async saveStickyRoles(guildId, userId, roles) {
    await pool.query(
      `INSERT INTO sticky_roles(guild_id, user_id, roles) 
       VALUES($1, $2, $3) 
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET roles = $3`,
      [guildId, userId, JSON.stringify(roles)]
    );
  },

  async getStickyRoles(guildId, userId) {
    const result = await pool.query(
      'SELECT roles FROM sticky_roles WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    if (result.rows.length === 0) return null;
    return JSON.parse(result.rows[0].roles);
  },

  async addInvite(guildId, inviterId, invitedId, inviteCode) {
    await pool.query(
      'INSERT INTO invites(guild_id, inviter_id, invited_id, invite_code) VALUES($1, $2, $3, $4)',
      [guildId, inviterId, invitedId, inviteCode]
    );
    await pool.query(
      `INSERT INTO invite_stats(guild_id, user_id, total_invites) 
       VALUES($1, $2, 1) 
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET total_invites = invite_stats.total_invites + 1`,
      [guildId, inviterId]
    );
  },

  async getInviteStats(guildId, userId) {
    const result = await pool.query(
      'SELECT * FROM invite_stats WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    if (result.rows.length === 0) return { total_invites: 0, left_invites: 0, fake_invites: 0 };
    return result.rows[0];
  },

  async getTopInviters(guildId, limit = 10) {
    const result = await pool.query(
      'SELECT user_id, total_invites, left_invites, fake_invites FROM invite_stats WHERE guild_id = $1 ORDER BY total_invites DESC LIMIT $2',
      [guildId, limit]
    );
    return result.rows;
  },

  async incrementMessageCount(guildId, userId) {
    await pool.query(
      `INSERT INTO message_stats(guild_id, user_id, message_count) 
       VALUES($1, $2, 1) 
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET message_count = message_stats.message_count + 1`,
      [guildId, userId]
    );
  },

  async getMessageStats(guildId, userId) {
    const result = await pool.query(
      'SELECT message_count FROM message_stats WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    if (result.rows.length === 0) return 0;
    return result.rows[0].message_count;
  },

  async getTopMessagers(guildId, limit = 10) {
    const result = await pool.query(
      'SELECT user_id, message_count FROM message_stats WHERE guild_id = $1 ORDER BY message_count DESC LIMIT $2',
      [guildId, limit]
    );
    return result.rows;
  },

  async addVoiceTime(guildId, userId, time) {
    await pool.query(
      `INSERT INTO voice_stats(guild_id, user_id, total_time) 
       VALUES($1, $2, $3) 
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET total_time = voice_stats.total_time + $3`,
      [guildId, userId, time]
    );
  },

  async getBalance(userId) {
    const result = await pool.query(
      'SELECT * FROM economy WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) return { balance: 0, bank: 0 };
    return result.rows[0];
  },

  async addBalance(userId, amount) {
    await pool.query(
      `INSERT INTO economy(user_id, balance) 
       VALUES($1, $2) 
       ON CONFLICT (user_id) 
       DO UPDATE SET balance = economy.balance + $2`,
      [userId, amount]
    );
  },

  async setDaily(userId) {
    await pool.query(
      `INSERT INTO economy(user_id, daily_last) 
       VALUES($1, $2) 
       ON CONFLICT (user_id) 
       DO UPDATE SET daily_last = $2`,
      [userId, Date.now()]
    );
  },

  async addAnimal(userId, name, rarity) {
    await pool.query(
      `INSERT INTO animals(user_id, name, rarity, count) 
       VALUES($1, $2, $3, 1) 
       ON CONFLICT (user_id, name) 
       DO UPDATE SET count = animals.count + 1`,
      [userId, name, rarity]
    );
  },

  async getZoo(userId) {
    const result = await pool.query(
      'SELECT * FROM animals WHERE user_id = $1 ORDER BY rarity, name',
      [userId]
    );
    return result.rows;
  },

  async createMarriage(user1Id, user2Id) {
    await pool.query(
      'INSERT INTO marriages(user1_id, user2_id) VALUES($1, $2)',
      [user1Id, user2Id]
    );
  },

  async getMarriage(userId) {
    const result = await pool.query(
      'SELECT * FROM marriages WHERE user1_id = $1 OR user2_id = $1',
      [userId]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },

  async deleteMarriage(userId) {
    await pool.query(
      'DELETE FROM marriages WHERE user1_id = $1 OR user2_id = $1',
      [userId]
    );
  },

  async addLootbox(userId, type) {
    await pool.query(
      `INSERT INTO lootboxes(user_id, type, count) 
       VALUES($1, $2, 1) 
       ON CONFLICT (user_id, type) 
       DO UPDATE SET count = lootboxes.count + 1`,
      [userId, type]
    );
  },

  async addAutoRole(guildId, roleId) {
    await pool.query(
      `INSERT INTO auto_roles(guild_id, role_id) 
       VALUES($1, $2) 
       ON CONFLICT (guild_id, role_id) 
       DO NOTHING`,
      [guildId, roleId]
    );
  },

  async getAutoRoles(guildId) {
    const result = await pool.query(
      'SELECT role_id FROM auto_roles WHERE guild_id = $1',
      [guildId]
    );
    return result.rows.map(row => row.role_id);
  },

  async removeAutoRole(guildId, roleId) {
    await pool.query(
      'DELETE FROM auto_roles WHERE guild_id = $1 AND role_id = $2',
      [guildId, roleId]
    );
  },

  async addAutoresponder(guildId, trigger, response, type) {
    await pool.query(
      'INSERT INTO autoresponders(guild_id, trigger, response, type) VALUES($1, $2, $3, $4)',
      [guildId, trigger, response, type]
    );
  },

  async removeAutoresponder(guildId, trigger) {
    await pool.query(
      'DELETE FROM autoresponders WHERE guild_id = $1 AND trigger = $2',
      [guildId, trigger]
    );
  },

  async getAutoresponders(guildId) {
    const result = await pool.query(
      'SELECT * FROM autoresponders WHERE guild_id = $1 AND enabled = true',
      [guildId]
    );
    return result.rows;
  },

  async toggleAutoresponders(guildId) {
    const result = await pool.query(
      'SELECT autoresponders_enabled FROM guild_config WHERE guild_id = $1',
      [guildId]
    );
    const currentState = result.rows.length > 0 ? result.rows[0].autoresponders_enabled : true;
    const newState = !currentState;
    
    await pool.query(
      `INSERT INTO guild_config(guild_id, autoresponders_enabled) 
       VALUES($1, $2) 
       ON CONFLICT (guild_id) 
       DO UPDATE SET autoresponders_enabled = $2`,
      [guildId, newState]
    );
    
    return newState;
  },

  async canClaimQuest(userId, questType) {
    const result = await pool.query(
      'SELECT * FROM quest_claims WHERE user_id = $1 AND quest_type = $2',
      [userId, questType]
    );
    
    if (result.rows.length === 0) return true;
    
    const lastClaim = result.rows[0].claimed_at;
    const now = Date.now();
    const timeWindow = questType === 'daily' ? 86400000 : 604800000;
    
    return (now - lastClaim) >= timeWindow;
  },

  async markQuestClaimed(userId, questType) {
    await pool.query(
      `INSERT INTO quest_claims(user_id, quest_type, claimed_at) 
       VALUES($1, $2, $3) 
       ON CONFLICT (user_id, quest_type) 
       DO UPDATE SET claimed_at = $3`,
      [userId, questType, Date.now()]
    );
  },

  async getNextQuestClaim(userId, questType) {
    const result = await pool.query(
      'SELECT claimed_at FROM quest_claims WHERE user_id = $1 AND quest_type = $2',
      [userId, questType]
    );
    
    if (result.rows.length === 0) return Math.floor(Date.now() / 1000);
    
    const lastClaim = result.rows[0].claimed_at;
    const timeWindow = questType === 'daily' ? 86400000 : 604800000;
    
    return Math.floor((lastClaim + timeWindow) / 1000);
  },

  async createProposal(proposerId, targetId) {
    await pool.query(
      'INSERT INTO marriage_proposals(proposer_id, target_id) VALUES($1, $2)',
      [proposerId, targetId]
    );
  },

  async getProposal(proposerId, targetId) {
    const result = await pool.query(
      'SELECT * FROM marriage_proposals WHERE proposer_id = $1 AND target_id = $2',
      [proposerId, targetId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  async deleteProposal(proposerId, targetId) {
    await pool.query(
      'DELETE FROM marriage_proposals WHERE proposer_id = $1 AND target_id = $2',
      [proposerId, targetId]
    );
  },

  async getVoiceStats(guildId, userId) {
    const result = await pool.query(
      'SELECT * FROM voice_stats WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    
    if (result.rows.length === 0) return null;
    
    const sessionsResult = await pool.query(
      'SELECT COUNT(*) as sessions, channel_name FROM voice_sessions WHERE guild_id = $1 AND user_id = $2 GROUP BY channel_name ORDER BY COUNT(*) DESC LIMIT 1',
      [guildId, userId]
    );
    
    return {
      totalTime: result.rows[0].total_time,
      sessions: sessionsResult.rows.length > 0 ? parseInt(sessionsResult.rows[0].sessions) : 0,
      favoriteChannel: sessionsResult.rows.length > 0 ? sessionsResult.rows[0].channel_name : null
    };
  },

  async addVoiceSession(guildId, userId, channelName, duration) {
    await pool.query(
      'INSERT INTO voice_sessions(guild_id, user_id, channel_name, duration) VALUES($1, $2, $3, $4)',
      [guildId, userId, channelName, duration]
    );
  },

  async getAutopinThreshold(guildId) {
    const result = await pool.query(
      'SELECT autopin_threshold FROM guild_config WHERE guild_id = $1',
      [guildId]
    );
    return result.rows.length > 0 ? result.rows[0].autopin_threshold : null;
  },

  async setAutopinThreshold(guildId, threshold) {
    await pool.query(
      `INSERT INTO guild_config(guild_id, autopin_threshold) 
       VALUES($1, $2) 
       ON CONFLICT (guild_id) 
       DO UPDATE SET autopin_threshold = $2`,
      [guildId, threshold]
    );
  },

  async createBackup(guildId, backupData) {
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await pool.query(
      'INSERT INTO backups(id, guild_id, backup_data, created_at) VALUES($1, $2, $3, $4)',
      [backupId, guildId, JSON.stringify(backupData), Date.now()]
    );
    return backupId;
  },

  async getBackups(guildId) {
    const result = await pool.query(
      'SELECT id, created_at FROM backups WHERE guild_id = $1 ORDER BY created_at DESC',
      [guildId]
    );
    return result.rows;
  },

  async getBackup(backupId) {
    const result = await pool.query(
      'SELECT * FROM backups WHERE id = $1',
      [backupId]
    );
    if (result.rows.length === 0) return null;
    return JSON.parse(result.rows[0].backup_data);
  },

  async addMoney(guildId, userId, amount) {
    await pool.query(
      `INSERT INTO guild_economy(guild_id, user_id, balance) 
       VALUES($1, $2, $3) 
       ON CONFLICT (guild_id, user_id) 
       DO UPDATE SET balance = guild_economy.balance + $3`,
      [guildId, userId, amount]
    );
  },

  async getBalance(guildId, userId) {
    const result = await pool.query(
      'SELECT balance FROM guild_economy WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId]
    );
    if (result.rows.length === 0) return 0;
    return result.rows[0].balance;
  },

  async getServerAnalytics(guildId) {
    return await this.getAnalytics(guildId);
  },
};

module.exports = { pool, db, initDatabase };
