const checkGuild = require("../../web.js").checkGuild;

module.exports.load = async function(app, db, settings, manager) {
  app.get("/manage/:id/regenerate", async (req, res) => {
    let guild = await checkGuild(req, res);
    if (guild) {
      await db.set(req.params.id + "-api", Math.random().toString(36).substr(2));
      res.redirect("/manage/" + req.params.id + "/overview");
    }
  });
}