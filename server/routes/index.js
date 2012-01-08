exports.get = require('./get.js');
exports.put = require('./put.js');

exports.index = function(req, res){
    res.send('Welcome to hell!');
};