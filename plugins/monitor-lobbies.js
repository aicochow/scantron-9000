let ws = require('ws');
let printf = require('printf');
let config = require('@/config');
let { discord, embed } = require('@/lib/discord');
let { servers, colors } = require('@/lib/dict');
let { timeago, detag, DOMMYYYY, HMS } = require('@/lib/util');
const axios = require('axios');
let M = {};
const headers = {
  'referer': 'https://wc3maps.com/live',
  'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
  'connection': 'keep-alive'
}

function main() {
  setInterval(fetchData, 5000)
}
function fetchData() {
  axios({
    method: 'get',
    url: 'https://wc3maps.com/api/lobbies',
    headers: headers,
  }).then(function (response) {
    if (!response.data.error && response.data.results) {
      console.log(response.data);
      let I = [];
      response.data.results.forEach(result => {
        I.push(result.host)
        if (result.host in M) {
          updateGame(result)
        } else {
          config.lobbies.guilds.forEach(guild => {
            guild.patterns.forEach(p => {
              if (result.path.match(p.map)) {
                createGame(result, guild)
              }
            })
          })
        }
      })

      for (const host in M) {
        if (!I.includes(host)) {
          deleteGame(host)
        }
      }

    }
  }).catch(function (error) {
    console.log(error)
  })
}

async function createGame(m, g) {
  let guild = await discord.guilds.fetch(g.id);
  let channel = guild.channels.cache.get(g.channel);

  M[m.host] = {
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

  await updateGame(m)
}

async function updateGame(m) {
  let k;
  let E;
  let g;
  let s;
  let e;

  if (m.host in M) {
    for (k of Object.keys(m)) M[m.host].game[k] = m[k];

    E = M[m.host];
    g = E.game;
    s = g.slots_taken / g.slots_total >= .6;

    e = embed()
      .setColor(s ? colors.yellow : colors.green)
      .setAuthor(g.host, 'https://dashboard.snapcraft.io/site_media/appmedia/2021/05/discord.png')
      .setDescription('**Created** : ' + timeago(g.created))
      .setTitle(M[m.host].mapName)
      .setURL(M[m.host].mapDownloadURL)
      .setThumbnail(M[m.host].mapThumbnail)
      .addFields(
        { name: 'Game Name', value: g.name },
        { name: 'Slots', value: g.slots_taken + '/' + g.slots_total, inline: true },
        { name: 'Server', value: servers[g.region], inline: true },
        { name: 'Map', value: g.path, inline: true },
      )

    if (!E.post) {
      printf(process.stdout, "LOBBIES :: Creating [%s]\n", m.host);
      E.post = await E.channel.send(E.ping || "", e);
    } else {
      printf(process.stdout, "LOBBIES :: Editing [%s]\n", m.host);
      await E.post.edit("", e);
    }
  }
}

async function deleteGame(host) {
  let E;
  let g;
  let e;

  E = M[host];
  g = E.game;

  e = embed()
    .setColor(colors.red)
    .setAuthor(g.host, 'https://dashboard.snapcraft.io/site_media/appmedia/2021/05/discord.png')
    .setDescription("**Started/Closed** after " + timeago(g.created))
    .setTitle(M[host].mapName)
    .setURL(M[host].mapDownloadURL)
    .setThumbnail(M[host].mapThumbnail)
    .addFields(
      { name: 'Game Name', value: g.name },
      { name: 'Slots', value: g.slots_taken + '/' + g.slots_total, inline: true },
      { name: 'Server', value: servers[g.region], inline: true },
      { name: 'Map', value: g.path, inline: true },
    )

  if (E.post) {
    printf(process.stdout, "LOBBIES :: Deleting [%s]\n", host);

    if (E.clean) {
      await E.post.delete();
    } else {
      await E.post.edit("", e);
    }
  }

  delete M[host];

}

module.exports = { main };