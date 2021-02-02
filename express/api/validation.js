const validAPI = require("../../web.js").validAPI;

module.exports.load = async function(app, db, settings, manager) {
  app.get("/api/:id/", async (req, res) => {
    let guild = await validAPI(req, res);
    if (guild) {
      res.send(
        {
          error: "none",
          guild: guild[0]
        }
      );
    };
  });
}