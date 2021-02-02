module.exports.load = async function(app, db, settings, manager) {
  app.get("/api/", async (req, res) => {
    res.send(
        {
          error: "none"
        }
      );
  });
}