// XXX: so kludje

var mongodb = require("mongodb"),
    options = require("../server-config.js");

var mongo = new mongodb.Server(options["mongo-host"], options["mongo-port"]),
    db = module.exports = exports = new mongodb.Db(options["mongo-database"], mongo);

db.open(function(error) {
    if (error) throw error;
});
