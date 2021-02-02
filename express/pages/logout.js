module.exports.load = async function(app, db, settings, manager) {
  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });
}