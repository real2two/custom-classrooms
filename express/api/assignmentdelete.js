const validAPI = require("../../web.js").validAPI;

module.exports.load = async function(app, db, settings, manager) {
  app.delete("/api/:id/assignment/delete", async (req, res) => {
    let guild = await validAPI(req, res);
    if (guild) {
      let currentassignment = await db.get(`${req.params.id}-assignment`);
      if (currentassignment) {
        await db.delete(`${req.params.id}-assignment`);
        res.send(
          {
            error: "none",
            assignment: currentassignment
          }
        );
      } else {
        res.send(
          {
            error: "there are no assignments to be deleted"
          }
        )
      }
    };
  });
}