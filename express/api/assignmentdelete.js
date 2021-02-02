const validAPI = require("../../web.js").validAPI;

module.exports.load = async function(app, db, settings, manager) {
  app.post("/api/:id/assignment/delete", async (req, res) => {
    let guild = await validAPI(req, res);
    if (guild) {
        await db.delete(`${req.params.id}-assignment`);
        res.send(
          {
            error: "none"
          }
        );
    };
  });
}