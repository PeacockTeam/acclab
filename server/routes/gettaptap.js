var db = require("../data/db.js");

var mongo = require('mongodb');
var BSON = mongo.BSONPure;

exports.filelist = function(req, res, next) {
    var sample = req.body;

    db.collection("taptapdata", function(error, collection) {
        collection.find({},
			{filename: 1, "data.metaData": 1}).toArray(
			    function(error, files) {
				console.log(files);
				res.send(files);
			    });
    });
};

exports.filedata = function(req, res, next) {
    var sample = req.body;
    var _id = req.params.id;

    console.log("Trying get info about", _id);
    db.collection("taptapdata", function(error, collection) {
        collection.find({ _id: new BSON.ObjectID(_id)}).toArray(
	    function(error, data) {
                res.send(data[0]);
	    });
    });
};
