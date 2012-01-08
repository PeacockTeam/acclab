// from there http://code.google.com/p/android/issues/detail?id=14141
// but differ for device (?)
var sensor_delay = {
    "SUPERFAST": 10, // hmm
    "FASTEST": Math.ceil(1000/30),
    "GAME": Math.ceil(1000/30),
    "UI": Math.ceil(1000/16.7),
    "NORMAL": Math.ceil(1000/8)
};

module.exports = {
    "http-host": "localhost",
    "http-port": 3000,
    "path": "/1.0/acc/put",
    "device_name": "random device2",
    "device_id": "Omg",
    "sensor_delay" : sensor_delay["FASTEST"]
};