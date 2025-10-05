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
};

module.exports = { pool, db, initDatabase };
