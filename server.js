var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 7000));
app.use(express.static(path.join(__dirname,'client')));
require('./config/mongoose.js');
require('./config/routes.js')(app);
var server = app.listen(app.get('port'), function() {
	console.log("temporaly Holla at port: 7000")
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
	console.log("socket connected");
	
})
