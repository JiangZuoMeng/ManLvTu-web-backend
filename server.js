var express = require('express');
var app = express();

// ManLvTu modules
// initialize filesystem
require('./public/javascripts/filesystem.js');
// initialize database
require('./public/javascripts/database.js');
// initialize routers
var topRouter = require('./routes/topRouter.js');
app.use('/', topRouter);

var server = app.listen(33000, '172.19.54.42', function() {
    console.log('server listening on %s %s', server.address().address, server.address().port);
});

/*
var server = app.listen(3000, function() {
    console.log('server listening on %s %s', server.address().address, server.address().port);
});
*/