let argv = (require('minimist'))(process.argv.slice(2));
let path = require('path');
let dotenv = require('dotenv');
let config = {};

dotenv.config({ path: path.resolve('.env') });

// --

config.argv = argv;

config.discord = {
  token: process.env.DISCORD_TOKEN,
  status: 'wc3stats.com',
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
        { map: /LTH/i }
      ]
    }
  ]
};

// --

module.exports = config;


    // replayWatcher: {
    //   allowedExtensions: [
    //     '.w3g'
    //   ],

    //   watch: [
    //     {
    //       guild: 'Deathknell',
    //       channels: [
    //         'test',
    //         '455928346547585024'
    //       ]
    //     }
    //   ]
    // },


    // /**
    //  * Game Watcher Subscription Patterns:
    //  *
    //  * {
    //  *    name   : <pattern>,
    //  *    server : <pattern>,
    //  *    map    : <pattern>,
    //  *    host   : <pattern>
    //  * }
    //  *
    //  */
    // gameWatcher: {
    //   updateInterval: 5000,

    //   subscriptions: [
    //     {
    //       guild: 'Deathknell',
    //       channel: '681316014344241172',
    //       ping: true,

    //       patterns: [
    //       ]
    //     },

    //     {
    //       guild: '553349292144721942',
    //       channel: '743298865792417802',
    //       ping: true,

    //       patterns: [
    //         new Pattern ({ map: /War.in.the.Plaguelands/i }),
    //         new Pattern ({ map: /Warhammer.Tides.of.Chaos/i }),
    //         new Pattern ({ map: /Warhammer.TOC/i }),
    //         new Pattern ({ map: /The.First.War/i }),
    //         new Pattern ({ map: /Game.of.Thrones/i }),
    //         new Pattern ({ map: /BFME/i }),
    //         new Pattern ({ map: /Battle.For.Middle.Earth/i }),
    //         new Pattern ({ map: /Conquest.of.Tel.Sirion/i }),
    //       ]
    //     },

    //     {
    //       guild: 'Broken Alliances',
    //       channel: '721485109764554865',
    //       clean: true,
    //       // ping: true,

    //       // colours: {
    //       //   open    : 'green',
    //       //   closing : 'green',
    //       //   closed  : 'red',
    //       //   started : 'red'
    //       // },

    //       patterns: [
    //         new Pattern ({
    //           map: /Broken.Alliances/i
    //         })
    //       ]
    //     },

    //     {
    //       guild: 'Coming of the Horde',
    //       channel: '409764349222322176',
    //       ping: true,

    //       patterns: [
    //         new Pattern ({
    //           map: /Coming of the Horde/i
    //         })
    //       ]
    //     }
    //   ]
    // },

  //   clanWatcher: {
  //     updateInterval: 1000 * 5 * 1,

  //     subscriptions: [
  //       {
  //         guild: 'Broken Alliances',

  //         lang: {
  //           clan: /Clan (.*)/,

  //           ranks: {
  //             'Chieftain' : 1,
  //             'Shaman' : 2,
  //             'Grunt' : 3,
  //             'Peon' : 4
  //           }
  //         }
  //       }
  //     ]
  //   }
  // }
// };

// export default config;