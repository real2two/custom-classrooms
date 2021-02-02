const Keyv = require("keyv");
let db = new Keyv('sqlite://database.sqlite');

module.exports = db;