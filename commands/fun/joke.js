module.exports = {
  name: 'joke',
  description: 'Get a random joke',
  async execute(message, args, client) {
    const jokes = [
      'Why don\'t scientists trust atoms? Because they make up everything!',
      'Why did the scarecrow win an award? He was outstanding in his field!',
      'Why don\'t eggs tell jokes? They\'d crack each other up!',
      'What do you call a bear with no teeth? A gummy bear!',
      'Why did the bicycle fall over? It was two-tired!',
      'What do you call a fish with no eyes? Fsh!',
      'Why did the coffee file a police report? It got mugged!',
    ];

    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    message.reply(`😂 ${joke}`);
  },
};
