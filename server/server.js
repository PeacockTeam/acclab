var util = require("util"),
    url = require("url"),
    express = require("express"),
    mongodb = require("mongodb"),
    options = require("./server-config.js");

// Don't crash on errors.
process.on("uncaughtException", function(error) {
  util.log(error.stack);
});

var mongo = new mongodb.Server(options["mongo-host"], options["mongo-port"]),
    db = new mongodb.Db(options["mongo-database"], mongo);

var app = express.createServer();

app.use(express.bodyParser());

// Because we use it from another origin
app.get('/*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    next();
});

app.get('/', function(req, res){
    res.send('Welcome to hell!');
});

app.post('/1.0/acc/put', function(req, res, next) {
    var sample = req.body;

    if (sample === undefined) {
	res.send({ error: "where data?" });
	res.end();
	return;
    }

    db.collection("accdata", function(error, collection) {
	var data = {
	    timestamp: +sample.timestamp,
	    device_id: sample.device_id,
	    device_name: sample.device_name,
	    data: sample.data,
	};

	collection.insert(data, { safe: true }, function(error) {
	    if (error) {
		res.send('somthing wrong: ' + error.message, 500);
	    } else {
		res.send('success');
	    }
	});
    });

    console.log(req.body);
});

// Get all devices that pushes data
app.get('/1.0/acc/get', function(req, res, next) {
    var sample = req.body;

    db.collection("accdata", function(error, collection) {
	collection.distinct("device_id", function(error, devices) {
	    console.log(devices);
	    res.send({ devices: devices });
	});
    });
});

// Get all samples for specific device
// TODO: add timerange?
app.get('/1.0/acc/get/:device', function(req, res, next) {
    var sample = req.body;
    var device = req.params.device;

    console.log("Trying get info about", device);

    db.collection("accdata", function(error, collection) {
	collection.find({ device_id: device }).toArray(function(err, items) {
	    res.send({ data: items });
	    res.end();
	});
    });

});

// XXX: really need?
db.open(function(error) {
    if (error) throw error;
});

app.listen(3000);
