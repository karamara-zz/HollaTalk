var mongoose = require('mongoose');
var User = mongoose.model("User");
module.exports = (function() {
	return {
	create : function(req,res){
		// it will check if user's phone number already exist and returns error message if they do
		User.findOne({phoneNumber : req.body.phoneNumber}, function(err, user){
			// console.log("checking if the user already exist")
			if (user){
				// console.log("users already exists",user)
				res.json(user)
			} else if (err) {
				// console.log("there is error finding the user");
				res.json({statis: false, error: err});
			}else {
				// console.log(req.body);
				var newUser = new User(req.body)
				newUser.created_at = Date.now();
				newUser.updated_at = Date.now();
				newUser.save(function(err){
					if (err){
						// what will do if eror occurs
						res.json({status: false, error: err})
						// console.log("there was error saving the user")
					} else {
						// console.log("no error saving")
						res.json(newUser)
						// pass back the status equal to true to confirm that saving was completed without error
					}
				})
			}
		})

	},
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
	addFriend: function(req, res){
		// console.log("adding "+ req.body.friendPhoneNumber+ " as a friend of "+ req.body.phoneNumber) ; 
		User.findOne({phoneNumber: req.body.friendPhoneNumber}, function(err, friend){
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
	}
}
})()