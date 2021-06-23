require('module-alias/register');

let printf = require('printf');
let config = require('@/config');
let { discord } = require('@/lib/discord');

discord.on('ready', () => {
  printf(process.stdout, "Logged in as [%s]\n", discord.user.tag);
  discord.user.setActivity(config.discord.status);
  require('@/plugins/monitor-lobbies').main();
});

discord.login(config.discord.token);

