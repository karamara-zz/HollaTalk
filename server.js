var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//session
var session = require('express-session');
app.use(session({
	secret: 'holla',
	resave: false,
	saveUninitialized: true
}))
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
	});
	socket.on('updateSocketID', function(data){
		data.cSocketID = socket.id;
		console.log(data, "data");

		// this will update the socket Id in the databas and emit to all the users' friend to update their friend online list.
		users.updateSocketID(data, function(){
			console.log(data, "updating socket id of user in user's friends",data.length)
			for (var idx = 0; idx < data.length; idx++){
				console.log("for loop",data[0])
				if (data[idx].cSocketID){
					console.log("ifstatement")
					var friendSocketID = data[idx].cSocketID;
					console.log("emitting to idx", friendSocketID)
					if (io.sockets.connected[friendSocketID]){
						console.log("emitting")
						io.sockets.connected[friendSocketID].emit('updateFriendList', data)
					}
				}
			}
		});

	});
	socket.on('disconnect', function(){
		users.disconnectSocket(socket.id);
	});
	socket.on('sendMessageToServer', function(data){
		console.log("sendmessage",data,"from socket id ",socket.id)
		if(data.sendTo){
			if (io.sockets.connected[data.sendTo]){
				console.log("really emitting the message to ", data.sendTo)
				io.sockets.connected[data.sendTo].emit('message', data);
			}
		}

	})
})
