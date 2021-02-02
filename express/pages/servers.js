const { Permissions } = require('discord.js');

module.exports.load = async function(app, db, settings, manager) {
  app.get("/servers", async (req, res) => {
    if (!req.session.userinfo) return res.redirect("/login");
    let userinfo = req.session.userinfo;
    let guilds = req.session.guilds;
    let guildlist = [];
    for (var i = 0, len = await guilds.length; i < len; i++) {
      let result = (await manager.broadcastEval(`this.guilds.cache.get('${guilds[i].id}');`));
      if (typeof result[0] == "object") {
        let result2 = (await manager.broadcastEval(`this.guilds.cache.get('${guilds[i].id}').members.fetch('${userinfo.id}');`));
        if (result2[0] !== undefined) {
          let result3 = (await manager.broadcastEval(`this.guilds.cache.get('${guilds[i].id}').members.cache.get('${userinfo.id}').hasPermission("ADMINISTRATOR");`));
          if (result3[0] == true) {
            guildlist.push({info: guilds[i], inguild: true});
          };
        };
      } else {
        if (new Permissions(guilds[i].permissions).has('MANAGE_GUILD')) {
          guildlist.push({info: guilds[i], inguild: false});
        };
      };
    };
    res.render("servers", {
      manager: manager,
      userinfo: userinfo,
      guilds: await guildlist
    });
  });
}