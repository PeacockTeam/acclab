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

// XXX: add check for data or not?
app.post('/1.0/acc/put', function(req, res, next) {
    var samples = req.body;

    if (samples === undefined) {
        res.send({ error: "where data?" });
        res.end();
        return;
    }

    if (samples instanceof Array == false) {
        res.send({ error: "broken data!" });
        res.end();
        return;
    }

    var samplesArray = [];
    samples.forEach(function(sample) {
        var data = {
            timestamp: +sample.timestamp,
            device_id: sample.device_id,
            device_name: sample.device_name,
            data: sample.data
        };
        samplesArray.push(data);
    });

    // XXX: move all db interaction to specific place?
    db.collection("accdata", function(error, collection) {
        collection.insert(samplesArray, { safe: true }, function(error) {
            if (error) {
                res.send('somthing wrong: ' + error.message, 500);
            } else {
                res.send('success');
            }
        });
    });
});

// Get all devices that pushes data
app.get('/1.0/acc/get', function(req, res, next) {
    var sample = req.body;

    db.collection("accdata", function(error, collection) {
	// Group by name and attach total of samples
        collection.group({ device_id: true },                       // keys
                         {},                                        // cond
                         { total: 0 },                              // initial
                         function(cur, prev) { prev.total += 1; },  // reduce
                         {},                                        // finalize
                         {},                                        // command
                         function(error, devices) {
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
	// XXX: now max samples is last max
	// TODO: implement offset, length param
	collection.find({ device_id: device }).count(function(err, count) {
	    var limit = count;
	    var skip = 0;
	    var max = 500;

	    if (limit > max) {
		var skip = limit - max;
		var limit = max;
	    }

            collection.find({ device_id: device }).skip(skip).limit(limit).toArray(function(err, items) {
		console.log("What", items.length);
		res.send({ data: items });
		res.end();
            });
	});
    });
});

// XXX: really need?
db.open(function(error) {
    if (error) throw error;
});

app.listen(3000);
