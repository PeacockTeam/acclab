var util = require("util"),
    url = require("url"),
    express = require("express"),
    routes = require('./routes');

var app = module.exports = express.createServer();

// Don't crash on errors.
process.on("uncaughtException", function(error) {
  util.log(error.stack);
});

app.use(express.bodyParser());
app.use(app.router);

// Because we use it from another origin
app.get('/*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    next();
});

app.get('/', routes.index);

app.post('/1.0/acc/put', routes.put.devicedata);

app.get('/1.0/acc/get', routes.get.devicelist);

app.get('/1.0/acc/get/:device', routes.get.devicedata);

app.get('/1.0/acc/taptap/get', routes.get.taptapfilelist);

app.get('/1.0/acc/taptap/get/:id', routes.get.taptapfiledata);

app.listen(3000);
