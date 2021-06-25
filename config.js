let argv = (require('minimist'))(process.argv.slice(2));
let path = require('path');
let dotenv = require('dotenv');
let config = {};

dotenv.config({ path: path.resolve('.env') });

// --

config.argv = argv;

config.discord = {
  token: process.env.DISCORD_TOKEN,
  status: 'Warcraft III',
  emojis: '454365223021707265'
};


config.lobbies = {
  guilds: [
    {
      id: '853212950688301076',
      channel: '856080526791409725',
      ping: false,
      clean: false,
      map: {
        thumbnail: 'https://wc3maps.com/maps/131593/archive/war3mapMap.jpg',
        name: 'Hero Push',
        downloadURL: 'https://wc3modding.info/5637/hero-push/dlattach/attach/2605/',
      },
      patterns: [
        { map: /Hero_Push/i }
      ]
    },
    {
      id: '853212950688301076',
      channel: '856080140470452244',
      ping: false,
      clean: false,
      map: {
        thumbnail: 'https://www.epicwar.com/assets/p/1251/312592.jpg',
        name: 'Lost Temple Heroes',
        downloadURL: 'https://www.epicwar.com/maps/download/312592/2057b7b9409703e817907cf30a3a0f04e5a948271e24f176f085493601cd608660d3145a/LTH2.1.4P.w3x',
      },
      patterns: [
        { map: /LTH\d\.\d\.\d/i }
      ]
    }
  ]
};
