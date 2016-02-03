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


// sockets

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
		users.updateSocketID(data, function(user){
			console.log(user, "updating socket id of user in user's friends", data)
			for (var idx = 0; idx < user.friends.length; idx++){
				console.log("for loop",data.friends[0])
				if (data.friends[idx].friend.cSocketID){
					console.log("ifstatement")
					var friendSocketID = data.friends[idx].friend.cSocketID;
					console.log("emitting to idx", friendSocketID)
					if (io.sockets.connected[friendSocketID]){
						console.log("emitting")
						io.sockets.connected[friendSocketID].emit('updateFriendList', data)
					}
				}
			}
		});
	});
	socket.on('disconnect', function(user){
		console.log(socket.id, " disconected a socket with this id", user)
		users.disconnectSocket(socket.id, function(user){
			console.log(user, "updating socket id of user in user's friends", user)
			for (var idx = 0; idx < user.friends.length; idx++){
				console.log("for loop",user.friends[0])
				if (user.friends[idx].friend.cSocketID){
					console.log("ifstatement")
					var friendSocketID = user.friends[idx].friend.cSocketID;
					console.log("emitting to idx", friendSocketID)
					if (io.sockets.connected[friendSocketID]){
						console.log("emitting")
						io.sockets.connected[friendSocketID].emit('updateFriendList', user)
					}
				}
			}
		});
	});
	socket.on('sendMessageToServer', function(data){
		console.log("sendmessage",data,"from socket id ",socket.id)
		users.unread(data, function(){
		if(data.sendTo.cSocketID){
			if (io.sockets.connected[data.sendTo.cSocketID]){
				console.log("really emitting the message to ", data.sendTo.cSocketID)
				io.sockets.connected[data.sendTo.cSocketID].emit('message', data);
				io.sockets.connected[data.sendTo.cSocketID].emit('newMessage', data);
			}
		} else {
			// if the reciever is offline
			console.log(data, "user is offline");
		}
		})


	})
})
