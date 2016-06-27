var express = require('express');
var app = express();

// ManLvTu modules
// initialize routers
var topRouter = require('./routes/topRouter.js');
app.use('/', topRouter);

var server = app.listen(33000, function() {
    console.log('server listening on %s %s', server.address().address, server.address().port);
});
