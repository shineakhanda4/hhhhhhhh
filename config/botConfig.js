module.exports = {
  prefix: process.env.PREFIX || 'r!',
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
