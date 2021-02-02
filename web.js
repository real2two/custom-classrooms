const settings = require("./settings.json");

const express = require("express");
const app = express();

const ejs = require("ejs");
const session = require("express-session");

const fs = require("fs");

const { Permissions } = require('discord.js');

app.use(express.json({
  inflate: true,
  limit: '500kb',
  reviver: null,
  strict: true,
  type: 'application/json',
  verify: undefined
}));

const listener = app.listen(settings.website.port, function() {
  console.log("[WEBSITE] The application is now listening on port " + listener.address().port + ".");
});

app.use(session({secret: settings.website.secret}));

app.set("view engine", "ejs");
app.set("views", "views");

const db = require('./database.js');

let manager;

module.exports.start = async function(m) {
  manager = m;

  let expressfiles = fs.readdirSync('./express/pages').filter(file => file.endsWith('.js'));

  expressfiles.forEach(file => {
    let expressfile = require(`./express/pages/${file}`);
    expressfile.load(app, db, settings, manager);
  });

  let apifiles = fs.readdirSync('./express/api').filter(file => file.endsWith('.js'));

  apifiles.forEach(file => {
    let apifile = require(`./express/api/${file}`);
    apifile.load(app, db, settings, manager);
  });
}

module.exports.checkGuild = checkGuild;
module.exports.validAPI = validAPI;

async function checkGuild(req, res) {
  if (!manager) return;
  if (!req.session.userinfo) return res.redirect("/");
  let userinfo = req.session.userinfo;
  let guild = req.session.guilds.filter(thing => thing.id == req.params.id)[0];
  if (guild) {
    let result = (await manager.broadcastEval(`this.guilds.cache.get('${guild.id}');`));
    if (typeof result[0] == "object") {
      let result2 = (await manager.broadcastEval(`this.guilds.cache.get('${guild.id}').members.fetch('${userinfo.id}');`));
      if (result2[0] !== undefined) {
        let result3 = (await manager.broadcastEval(`this.guilds.cache.get('${guild.id}').members.cache.get('${userinfo.id}').hasPermission("ADMINISTRATOR");`));
        if (result3[0] == true) {
          if (!(await db.get(guild.id + "-api"))) {
            await db.set(guild.id + "-api", Math.random().toString(36).substr(2));
          };
          return guild;
        };
      };
    } else {
      if (new Permissions(guild.permissions).has('MANAGE_GUILD')) {
        return res.redirect("https://discord.com/api/oauth2/authorize?client_id=" + settings.discord.oauth2.id + "&permissions=67497025&redirect_uri=" + settings.discord.oauth2.callback + "&response_type=code&scope=identify%20guilds%20bot&guild_id=" + encodeURIComponent(req.params.id) + "&disable_guild_select=true");
      };
    };
  };
  return res.redirect("/servers");
};

async function validAPI(req, res) {
  let key = await db.get(req.params.id + "-api");
  if (key) {
    if (req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        let auth = req.headers.authorization.slice(7);
        if (key == auth) {
          let result = (await manager.broadcastEval(`this.guilds.cache.get('${req.params.id}');`));
          if (typeof result[0] == "object") {
            return result;
          } else {
            res.json({error:"bot left server"});
          };
        } else {
          res.json({error:"invalid authorization"});
        };
      } else {
        res.json({error:"invalid authorization"});
      };
    } else {
      res.json({error:"invalid authorization"});
    };
  } else {
    res.json({error: "invalid server id"});
  };
  return false;
};