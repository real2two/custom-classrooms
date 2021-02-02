module.exports.load = async function(app, db, settings, manager) {
  app.get("/login", (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=` + settings.discord.oauth2.id + `&redirect_uri=` + settings.discord.oauth2.callback + `&response_type=code&scope=identify%20guilds%20email&prompt=none`);
  });
}