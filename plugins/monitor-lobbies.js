let ws = require('ws');
let printf = require('printf');
let config = require('@/config');
let { discord, embed } = require('@/lib/discord');
let { servers, colors } = require('@/lib/dict');
let { timeago, detag, DOMMYYYY, HMS } = require('@/lib/util');
let M = {};

function main() {
  let wss = new ws('ws://ws.wc3stats.com');

  wss.on('open', () => {
    wss.on('message', (m) => {
      m = JSON.parse(m);

      switch (m.messageType) {
        case 'GameListCreate': createGame(m.message); break;
        case 'GameListUpdate': updateGame(m.message); break;
        case 'GameListDelete': deleteGame(m.message); break;
      }
    });

    let m = JSON.stringify({
      messageType: "Subscribe",
      message: [
        "GameList"
      ]
    });

    wss.send(m);
  });
  // wss.onclose = function (e) {
  //   for (let k of Object.keys(M)) {
  //     let E = M[k];

  //     if (E.post) {
  //       M[k].post.delete();
  //     }
  //   }
  //   setTimeout(main, 1000 * 10 + Math.random() * 5000);
  // };
}

async function createGame(m) {
  for (let i = 0; i < config.lobbies.guilds.length; i++) {
    let g;
    let guild;
    let channel;

    g = config.lobbies.guilds[i];

    if (matches(m, g.patterns)) {
      guild = await discord.guilds.fetch(g.id);
      channel = guild.channels.cache.get(g.channel);

      M[m.id] = {
        guild,
        channel,
        ping: g.ping,
        clean: g.clean,
        game: m,
        mapThumbnail: g.map.thumbnail,
        mapName: g.map.name,
        mapDownloadURL: g.map.downloadURL,
        post: null
      };

      await updateGame(m);
    }
  }
}

async function updateGame(m) {
  let k;
  let E;
  let g;
  let s;
  let e;

  if (m.id in M) {
    for (k of Object.keys(m)) M[m.id].game[k] = m[k];

    E = M[m.id];
    g = E.game;
    s = g.slotsTaken / g.slotsTotal >= .6;

    // --

    e = embed()
      .setColor(s ? colors.yellow : colors.green)
      .setAuthor(g.host, 'https://dashboard.snapcraft.io/site_media/appmedia/2021/05/discord.png')
      .setDescription('**Created** : ' + timeago(g.created))
      .setTitle(M[m.id].mapName)
      .setURL(M[m.id].mapDownloadURL)
      .setThumbnail(M[m.id].mapThumbnail)
      .addFields(
        { name: 'Game Name', value: g.name },
        { name: 'Slots', value: g.slotsTaken + '/' + g.slotsTotal, inline: true },
        { name: 'Server', value: servers[g.server], inline: true },
        { name: 'Map', value: g.map, inline: true },
      )

    // --

    if (!E.post) {
      printf(process.stdout, "LOBBIES :: Creating [%d]\n", m.id);
      E.post = await E.channel.send(E.ping || "", e);
    } else {
      printf(process.stdout, "LOBBIES :: Editing [%d]\n", m.id);
      await E.post.edit("", e);
    }
  }
}

async function deleteGame(m) {
  let E;
  let g;
  let e;

  if (m.id in M) {
    for (k of Object.keys(m)) M[m.id].game[k] = m[k];

    E = M[m.id];
    g = E.game;

    // --
    e = embed()
      .setColor(g.started ? colors.purple : colors.red)
      .setAuthor(g.host, 'https://dashboard.snapcraft.io/site_media/appmedia/2021/05/discord.png')
      .setDescription(g.started ? "**Started** after " + HMS(g.uptime) : '**Closed** after ' + HMS(g.uptime))
      .setTitle(M[m.id].mapName)
      .setURL(M[m.id].mapDownloadURL)
      .setThumbnail(M[m.id].mapThumbnail)
      .addFields(
        { name: 'Game Name', value: g.name },
        { name: 'Slots', value: g.slotsTaken + '/' + g.slotsTotal, inline: true },
        { name: 'Server', value: servers[g.server], inline: true },
        { name: 'Map', value: g.map, inline: true },
      )

    // --

    if (E.post) {
      printf(process.stdout, "LOBBIES :: Deleting [%d]\n", m.id);

      if (E.clean) {
        await E.post.delete();
      } else {
        await E.post.edit("", e);
      }
    }

    delete M[m.id];
  }
}

function matches(m, P) {
  for (let i = 0; i < P.length; i++) {
    let s = 1;

    for (let k of Object.keys(P[i])) {
      if (!P[i][k].test(m[k])) {
        s = 0;
        break;
      }
    }

    if (s) return (1);
  }

  return (0);
}

module.exports = { main };