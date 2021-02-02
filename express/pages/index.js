module.exports.load = async function(app, db, settings, manager) {
  app.get("/", (req, res) => {
    let error = req.session.error;
    let userinfo = req.session.userinfo;
    let guilds = req.session.guilds;
    res.render("index", {
      error: error,
      userinfo: userinfo,
      guilds: guilds
    });
    delete req.session.error;
  });
}