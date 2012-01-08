var db = require("../data/db.js");

// All method which put data
exports.devicedata = function(req, res, next) {
    var samples = req.body;

    if (samples === undefined) {
        res.send({ error: "where data?" });
        return;
    }

    if (samples instanceof Array == false) {
        res.send({ error: "broken data!" });
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
};

