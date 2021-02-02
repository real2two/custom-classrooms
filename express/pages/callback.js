const fetch = require('node-fetch');

module.exports.load = async function(app, db, settings, manager) {
  app.get("/callback", async (req, res) => {
    delete req.session.userinfo;
    delete req.session.guilds;
    
    let json = await fetch(
      'https://discord.com/api/oauth2/token',
      {
        method: "post",
        body: "client_id=" + settings.discord.oauth2.id + "&client_secret=" + settings.discord.oauth2.secret + "&grant_type=authorization_code&code=" + encodeURIComponent(req.query.code) + "&redirect_uri=" + encodeURIComponent(settings.discord.oauth2.callback),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    if (json.ok == true) {
      let codeinfo = JSON.parse(await json.text());
      let scopes = codeinfo.scope;
      let missingscopes = [];

      if (scopes.replace(/identify/g, "") == scopes) missingscopes.push("identify");
      if (scopes.replace(/email/g, "") == scopes) missingscopes.push("email");
      if (scopes.replace(/guilds/g, "") == scopes) missingscopes.push("guilds");

      if (missingscopes.length !== 0) {
        req.session.error = "Missing scopes: " + missingscopes.join(", ");
        return res.redirect("/");
      }

      let userjson = await fetch(
        'https://discord.com/api/users/@me',
        {
          method: "get",
          headers: {
            "Authorization": `Bearer ${codeinfo.access_token}`
          }
        }
      );

      let userinfo = JSON.parse(await userjson.text());
      if (userinfo.verified == true) {

        let guildsraw = await fetch('https://discordapp.com/api/users/@me/guilds', {
          method: "get",
          headers: {
            "Authorization": `Bearer ${codeinfo.access_token}`
          }
        });
        let guilds = JSON.parse(await guildsraw.text());
        req.session.guilds = guilds;

        delete req.session.error;
        req.session.userinfo = userinfo;
        res.redirect("/servers");
      } else {
        req.session.error = "Unverified Discord account.";
        res.redirect("/");
      }
    } else {
      req.session.error = "Invalid code.";
      res.redirect("/");
    }
  });
}