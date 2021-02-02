const settings = require("./settings.json");

const db = require('./database.js');

const Discord = require('discord.js');
const client = new Discord.Client(
  {
    presence: {
      activity: {
        name: 'students',
        type: 'WATCHING'
      },
      status: 'online'
    },
    messageCacheLifetime: 300,
    messageSweepInterval: 600
  }
);

client.on('ready', async () => {
  //console.log('[Bot] Bot is ready!');
});

client.on('message', async message => {
  try {
    let prefix = await db.get(`${message.guild.id}-prefix`);
    prefix = prefix ? prefix : settings.default.prefix;
    if (message.content.startsWith(prefix)) {
      let cmd = message.content.slice(prefix.length).split(" ")[0].toLowerCase();
      if (cmd == "assignment") {
        let assignment = await db.get(`${message.guild.id}-assignment`);
        if (assignment) {
          message.channel.send({
            embed: {
              color: 0x023FF00,
              title: assignment.name,
              description: assignment.description,
              footer: {
                text: 'This text has been generated by user input.'
              }
            }
          });
        } else {
          message.channel.send({
            embed: {
              color: 0x0FF0000,
              title: "There are no assignments currently!",
              description: "[insert random message here]"
            }
          });
        }
      }
    }
  } catch(err) {
    console.log(err);
  };
});

client.login(settings.discord.bot.token);