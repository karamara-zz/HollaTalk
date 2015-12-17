var mongoose = require('mongoose');
var User = mongoose.model("User");
module.exports = (function() {
	return {
	show: function(req,res){
		// console.log("fetching friend list for "+ req.params.userPhoneNumber);
		var userNumber = req.params.userPhoneNumber
		User.findOne({phoneNumber: userNumber})
		.populate('friends')
		.exec(function (err, friendsList){
			if (err){
				// console.log("there was error populating friendsList");
			} else {
				// console.log("friends list successfully populated", friendsList);
				res.json(friendsList);
			}
		})
	},
	logIn: function(req, res){
		console.log(req.body);
		User.findOne({phoneNumber : req.body.phoneNumber, password: req.body.password}, function(err, user){
			if (user) {
				req.session.user = user;
				console.log(req.session);
				user.session = req.session
				res.json({status: true, response: user});
			} else if (err){
				res.json({status: false, error: err});
			} else {
				res.json({status: false, error: "login credencial doesn't match the database."})
			}
		})
	},
	find: function(data, socket){
		// console.log("finding the friend who user wants to talk", data);
		User.findOne({phoneNumber: data.phoneNumber})
			.populate('friends')
			.exec(function(err, user){
			if (err){
				// console.log("there was error")
			} else {
				console.log("user found ", user)
				socket.emit("receiver", user);
				// for (var friend = 0; friend < user.friends.length; friend++){
				// 	if (user.friends[friend].cSocketID){
				// 		io.sockets.connected[user.friends[friend].cSocketID].emit('updateFriendList')
				// 	}
				// 	console.log(1, user.friends[friend].cSocketID)
				// }
			}
		})
	},
	updateSocketID: function(data, callback){
		// console.log(data);
		// User.findOne({phoneNumber:data.phoneNumber}, function(err, user){
		// 	if (err){
		// 		console.log("there was error");
		// 	} else {
		// 		user.cSocketID = data.cSocketID;
		// 		user.save(function(err){
		// 			if(err){
		// 				console.log("there was error");

		// 			} else {
		// 				console.log("Socket updated");
		// 			}
		// 		})
		// 	}
		// })
		//trying to use update
		//
		User.update({phoneNumber:data.phoneNumber}, {cSocketID: data.cSocketID}, function(err, user){
			if (err){
				console.log("there was error", err)
			} else {
				console.log("socket updated", user)
				callback()
			}
		})

	},
	disconnectSocket: function(socketID){
		console.log(socketID);
		User.findOne({cSocketID: socketID}, function(err, userData){
			if (err){
				console.log("there was error")
			} else if (userData) {
				userData.cSocketID = undefined;
				userData.save(function(err){
					if(err){
						console.log("there was error");

					} else {
						console.log("Socket disconnected");
						for (var friend = 0; friend < userData.friends.length; friend++){

							if (userData.friends[friend].cSocketID){
								var friendSocketID = userData.friends[friend].cSocketID;
								console.log("emitting to friend", friendSocketID)
								if (io.sockets.connected[friendSocketID]){
									console.log("emitting")
									io.sockets.connected[friendSocketID].emit('updateFriendList', userData)
								}
							}
							console.log(1, userData.friends[friend].cSocketID, friend, userData.friends.length)
						}
					}
				})
			} else {
				console.log("could not find the user with the socketID")
			}
		})
	},
	create: function(req, res){
		// console.log("adding "+ req.body.friendPhoneNumber+ " as a friend of "+ req.body.phoneNumber) ; 
		User.findOne({phoneNumber: req.body.friendPhoneNumber}, function(err, friend){
			console.log("////////////////////////////////////////", req.session)
			// console.log(friend, "friend returned by finding one");
			if (err || friend === null){
				// console.log("there was error")
				res.json({status: false, error: "the friend does not exist"})

			} else {
				// console.log("the friend found adding a friend to the user")
				User.findOne({phoneNumber: req.body.phoneNumber}, function(err, user){
					if (err){
						// console.log("there was error finding user")
					} else {
						// console.log("user found");
						user.friends.push(friend);
						user.save(function(err){
							if (err){
								// console.log("error");
 							} else {
 								res.json({status: true});
 							}
						})
					}
				})
			}
		})
	},
	session: function(req, res){
		res.json(req.session)
	}
}
})()