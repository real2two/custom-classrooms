const checkGuild = require("../../web.js").checkGuild;

module.exports.load = async function(app, db, settings, manager) {
  app.get("/manage/:id/overview", async (req, res) => {
    let guild = await checkGuild(req, res);
    if (guild) {
      let prefix = await db.get(`${req.params.id}-prefix`);
      let assignment = await db.get(`${req.params.id}-assignment`);
      res.render("overview", {
        userinfo: req.session.userinfo,
        guild: guild,
        prefix: (prefix ? prefix : settings.default.prefix),
        assignment: (assignment ? assignment : null),
        api: await db.get(guild.id + "-api")
      });
    };
  });
}