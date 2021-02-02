const validAPI = require("../../web.js").validAPI;

module.exports.load = async function(app, db, settings, manager) {
  app.post("/api/:id/assignment/create", async (req, res) => {
    let guild = await validAPI(req, res);
    if (guild) {
      if (typeof req.body == "object") {
        if (!Array.isArray(req.body)) {
          if (typeof req.body.name == "string") {
            if (typeof req.body.description == "string") {
              let assignment = {
                name: req.body.name,
                description: req.body.description
              };
              if (assignment.name.length < 1 || assignment.name.length > 256) {
                res.send({ error: "name must be 1-256 characters" })
              } else {
                if (assignment.description.length < 1 || assignment.description.length > 2048) {
                  res.send({ error: "description must be 1-2048 characters" })
                } else {
                  await db.set(`${req.params.id}-assignment`, assignment);
                  res.send(
                    {
                      error: "none",
                      assignment: assignment
                    }
                  );
                }
              }
            } else {
              res.send({ error: "body.description must be a string" });
            }
          } else {
            res.send({ error: "body.name must be a string" });
          }
        } else {
          res.send({ error: "body cannot be an array" });
        }
      } else {
        res.send({ error: "body must be an object" });
      }
    };
  });
}