const settings = require("./settings.json");

require("./database.js");

let web = require("./web.js");

let { ShardingManager } = require('discord.js');
let manager = new ShardingManager('./bot.js', { token: settings.discord.bot.token });

manager.on('shardCreate', shard => console.log(`[Shard ${shard.id}] Shard is ready!`));
manager.spawn();

web.start(manager);