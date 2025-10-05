class Database {
  constructor() {
    this.warnings = new Map();
    this.mutes = new Map();
    this.tickets = new Map();
    this.tags = new Map();
    this.triggers = new Map();
    this.suggestions = new Map();
    this.giveaways = new Map();
    this.reminders = new Map();
    this.afk = new Map();
    this.notes = new Map();
    this.reactionRoles = new Map();
    this.analytics = new Map();
    this.customCommands = new Map();
    this.userStats = new Map();
  }

  addWarning(guildId, userId, reason, moderator) {
    const key = `${guildId}-${userId}`;
    if (!this.warnings.has(key)) {
      this.warnings.set(key, []);
    }
    this.warnings.get(key).push({
      reason,
      moderator,
      timestamp: Date.now(),
    });
  }

  getWarnings(guildId, userId) {
    const key = `${guildId}-${userId}`;
    return this.warnings.get(key) || [];
  }

  clearWarnings(guildId, userId) {
    const key = `${guildId}-${userId}`;
    this.warnings.delete(key);
  }

  addMute(guildId, userId, duration, reason) {
    const key = `${guildId}-${userId}`;
    this.mutes.set(key, {
      duration,
      reason,
      timestamp: Date.now(),
    });
  }

  removeMute(guildId, userId) {
    const key = `${guildId}-${userId}`;
    this.mutes.delete(key);
  }

  getMute(guildId, userId) {
    const key = `${guildId}-${userId}`;
    return this.mutes.get(key);
  }

  createTicket(ticketId, data) {
    this.tickets.set(ticketId, data);
  }

  getTicket(ticketId) {
    return this.tickets.get(ticketId);
  }

  closeTicket(ticketId) {
    this.tickets.delete(ticketId);
  }

  addTag(guildId, name, content) {
    const key = `${guildId}-${name}`;
    this.tags.set(key, { content, uses: 0, createdAt: Date.now() });
  }

  getTag(guildId, name) {
    const key = `${guildId}-${name}`;
    return this.tags.get(key);
  }

  deleteTag(guildId, name) {
    const key = `${guildId}-${name}`;
    this.tags.delete(key);
  }

  getAllTags(guildId) {
    const tags = [];
    for (const [key, value] of this.tags) {
      if (key.startsWith(`${guildId}-`)) {
        const name = key.split('-')[1];
        tags.push({ name, ...value });
      }
    }
    return tags;
  }

  addSuggestion(messageId, data) {
    this.suggestions.set(messageId, data);
  }

  getSuggestion(messageId) {
    return this.suggestions.get(messageId);
  }

  updateSuggestion(messageId, status) {
    const suggestion = this.suggestions.get(messageId);
    if (suggestion) {
      suggestion.status = status;
    }
  }

  createGiveaway(messageId, data) {
    this.giveaways.set(messageId, data);
  }

  getGiveaway(messageId) {
    return this.giveaways.get(messageId);
  }

  endGiveaway(messageId) {
    this.giveaways.delete(messageId);
  }

  getAllActiveGiveaways() {
    return Array.from(this.giveaways.values());
  }

  addReminder(userId, data) {
    if (!this.reminders.has(userId)) {
      this.reminders.set(userId, []);
    }
    this.reminders.get(userId).push(data);
  }

  getUserReminders(userId) {
    return this.reminders.get(userId) || [];
  }

  removeReminder(userId, index) {
    const reminders = this.reminders.get(userId);
    if (reminders) {
      reminders.splice(index, 1);
    }
  }

  setAFK(userId, message) {
    this.afk.set(userId, { message, timestamp: Date.now() });
  }

  getAFK(userId) {
    return this.afk.get(userId);
  }

  removeAFK(userId) {
    this.afk.delete(userId);
  }

  addNote(guildId, userId, note) {
    const key = `${guildId}-${userId}`;
    if (!this.notes.has(key)) {
      this.notes.set(key, []);
    }
    this.notes.get(key).push({ note, timestamp: Date.now() });
  }

  getNotes(guildId, userId) {
    const key = `${guildId}-${userId}`;
    return this.notes.get(key) || [];
  }

  addReactionRole(messageId, emoji, roleId) {
    if (!this.reactionRoles.has(messageId)) {
      this.reactionRoles.set(messageId, new Map());
    }
    this.reactionRoles.get(messageId).set(emoji, roleId);
  }

  getReactionRole(messageId, emoji) {
    const roles = this.reactionRoles.get(messageId);
    return roles ? roles.get(emoji) : null;
  }

  trackEvent(guildId, eventType) {
    if (!this.analytics.has(guildId)) {
      this.analytics.set(guildId, {
        messagesSent: 0,
        membersJoined: 0,
        membersLeft: 0,
        commandsUsed: 0,
        moderationActions: 0,
      });
    }
    const stats = this.analytics.get(guildId);
    if (eventType in stats) {
      stats[eventType]++;
    }
  }

  getAnalytics(guildId) {
    return this.analytics.get(guildId) || null;
  }
}

module.exports = new Database();
