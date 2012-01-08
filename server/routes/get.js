var db = require("../data/db.js");

// move from there?

exports.taptapfilelist = require('./gettaptap').filelist;
exports.taptapfiledata = require('./gettaptap').filedata;

exports.devicelist = function(req, res, next) {
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
};

// Get all samples for specific device
exports.devicedata = function(req, res, next) {
    var sample = req.body;
    var device = req.params.device;

    console.log("Trying get info about", device);

    db.collection("accdata", function(error, collection) {
        collection.find({ device_id: device }).toArray(function(err, items) {
	    console.log("What?", items.length);
	    res.send({ data: items });
        });
    });
};
