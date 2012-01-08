/**
 * 
 * $ find taptapdata/ | xargs -n1 node <this script>
 * 
 */

var fs = require('fs'),
    path = require('path'),
    xml2js = require('xml2js'),
    mongodb = require("mongodb");

var options = require("../server/server-config.js");

var mongo = new mongodb.Server(options["mongo-host"], options["mongo-port"]),
    db = new mongodb.Db(options["mongo-database"], mongo);

db.open(function(error) {
    if (error) throw error;
});

var parser = new xml2js.Parser({ mergeAttrs: true });

fs.readFile(__dirname + "/" + process.argv[2], function(err, data) {
    parser.parseString(data, function (err, result) {

	// to file
/*        fs.writeFile(__dirname + "/json/" + path.basename(process.argv[2].replace("xml", "json")),
                     JSON.stringify(result, null, 4),
                     function(err) {
                         if (err) throw err;
                     });*/

	// to mongo
	db.collection("taptapdata", function(error, collection) {
            collection.insert(
		{ filename: path.basename(process.argv[2]), data: result },
		{ safe: true },
		function(error) {
		    if (error) {
			console.log('somthing wrong: ' + error.message);
		    } else {
			console.log('success');
		    }
		    db.close();
		});
	});

        console.log('Done', process.argv[2]);
    });
});