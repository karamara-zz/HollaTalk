var express = require('express');
var path = require('path');
var app = express();

console.log("routes")
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
var users = require('./server/controllers/users.js');
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
	console.log("socket connected", socket.id);
	socket.on("startedChat", function(data){
		console.log(data)
		users.find(data, socket);
		// var xxx = "chris"
		// console.log(receiver);
		// io.sockets.emit('receiver',xxx);
	});
	socket.on('updateSocketID', function(data){
		data.cSocketID = socket.id;
		console.log(data);
		users.updateSocketID(data)
	});
	socket.on('disconnect', function(){
		users.disconnectSocket(socket.id);
	});
	socket.on('sendMessage', function(sendTo){
		console.log("sendmessage")
	})
})
