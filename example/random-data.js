var querystring = require('querystring');
var http = require('http');
var options = require('./random-data-config');

// TODO: think about specific device name/id
// or randomly?

var samples = [];
var num_of_chunks_to_send = 400;

var interval = setInterval(function() {

    console.log(samples.length);

    var data = {
	timestamp: new Date().getTime(),
	device_name: options["device_name"],
	device_id: options["device_id"],
	data: {
	    x: Math.random() * 10,
	    y: Math.random() * -10,
	    z: Math.random() * 10
	}
    };

    samples.push(data);

    if (samples.length > num_of_chunks_to_send) {
	console.log("Trying to send", samples.length);
	sendPost(JSON.stringify(samples));

	samples = [];
    }
}, options["sensor_delay"]);

function sendPost(post_data) {
    var post_options = {
	host: options["http-host"],
	port: options["http-port"],
	path: options["path"],
	method: 'POST',
	headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
	}
    };

    var post_req = http.request(post_options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
	});
    });

    post_req.write(post_data);
    post_req.end();
}

process.on("SIGINT", function() {
    console.log("stop");
    clearInterval(interval);
});
