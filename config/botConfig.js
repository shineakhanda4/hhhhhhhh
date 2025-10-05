module.exports = {
  prefix: process.env.PREFIX || '!',
  embedColor: '#5865F2',
  ownerIds: [],
  
  automod: {
    enabled: true,
    spamThreshold: 5,
    spamTimeWindow: 5000,
    profanityFilter: ['badword1', 'badword2'],
    maxMentions: 5,
    maxEmojis: 10,
    capsPercentage: 70,
  },
  
  antinuke: {
    enabled: false,
    maxChannelDeletes: 3,
    maxRoleDeletes: 3,
    maxBans: 3,
    maxKicks: 5,
    timeWindow: 10000,
    punishmentType: 'remove_permissions',
  },
  
  ticket: {
    categoryName: 'Tickets',
    transcriptChannel: null,
    supportRoles: [],
  },
  
  logging: {
    enabled: true,
    logChannel: null,
  },
  
  suggestions: {
    channel: null,
    votingEmojis: {
      upvote: '👍',
      downvote: '👎',
    },
  },
  
  giveaway: {
    defaultEmoji: '🎉',
  },
};
