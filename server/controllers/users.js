var mongoose = require('mongoose');
var User = mongoose.model("User");
var session = require('express-session');
module.exports = (function() {
	return {
	create : function(req, res){
		// it will check if user's phone number already exist and returns error message if they do
		console.log(req.body)
		User.findOne({phoneNumber : req.body.phoneNumber}, function(err, user){
			// console.log("checking if the user already exist")
			if (user){
				console.log("users already exists",user)
				req.session.user = user;
				console.log(req.session);
				user.session = req.session
				res.json({status: false, error: "The phone number already registered in our database"})
			} else if (err) {
				console.log("there is error finding the user", err);
				res.json({status: false, error: err});
			}else {
				// console.log(req.body);
				var newUser = new User(req.body)
				newUser.save(function(err){
					if (err){
						// what will do if eror occurs
						res.json({status: false, error: err})
						// console.log("there was error saving the user")
					} else {
						// console.log("no error saving")
						res.json({status: true})
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
	logIn: function(req, res){
		// console.log(req.body, "in users controller");
		User.findOne({phoneNumber : req.body.phoneNumber}, function(err, user){
			if (user) {
				if (user.password == req.body.password){
					req.session.user = user;
					// console.log(req.session, "valid log in sending back the user object with session included");
					user = {
						name : user.name,
						phoneNumber : user.phoneNumber,
						_id : user._id
					}
					// console.log("removed password", user)
					res.json({status: true, user: user});
				} else {
					// console.log("password doesn't match");
					res.json({status: false, error: "login credencial doesn't match the database."})
				}
			} else if (err){
				// console.log(err, "error retrieving user information for login")
				res.json({status: false, error: err});
			} else {
				// console.log("there was no user")
				res.json({status: false, error: "there was no user found on the database"})
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
	disconnectSocket: function(socketId,callback){
		// console.log("fetching friend list for "+ req.params.userPhoneNumber);
		User.findOne({cSocketID: socketId})
		.populate('friends')
		.exec(function(err, user){
			if (err){
				// console.log("there was error");
			} else if (user){
				user.cSocketID = undefined;
				user.save(function(err){
					if(err){
						// console.log("there was error");

					} else {
						// console.log("Socket updated");
					}
				})
				callback(user);
			} else {
				// console.log("user not found with socket id")
			}
		})
	},
	updateSocketID: function(data, callback){
		// console.log(data);
		User.findOne({phoneNumber:data.phoneNumber}, function(err, user){
			if (err){
				// console.log("there was error");
			} else {
				user.cSocketID = data.cSocketID;
				user.save(function(err){
					if(err){
						// console.log("there was error");

					} else {
						// console.log("Socket updated");
						callback(user);
					}
				})
				callback(user);
			}
		})
	},
	addFriend: function(req, res){
		// console.log("adding "+ req.body.friendPhoneNumber+ " as a friend of "+ req.body.phoneNumber) ; 
		User.findOne({phoneNumber: req.body.friendPhoneNumber}, function(err, friend){
			// console.log("////////////////////////////////////////", req.session)
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
	// session 
	
	destroySession: function(req){
		// console.log("function destory session", req.session)
		req.session.destroy(function(err){
			if (err){
				// console.log("there was error destroying the session");
			}
		})
	},
	session: function(req, res){
		res.json(req.session)
	},
	// message sent to offline user
	offlineSocket: function(data){
		User.findOne({_id: data.sentFrom._id})
			.populate('friends')
			.exec(function(err, user){
				if (err){
					console.log("there was error", err)
				} else if (user) {
					console.log(user)
					for (friend in user.friends){
						if (user.friends[friend]._id == data.sendTo._id){
						user.friends[friend].newMessage = true;
						console.log(user.friends[friend], "changed the newmessages status of friend");
							user.save(function(err){
								if (err){
									console.log("there was error", err);
								} else {
									console.log("user's newMessage status successfully updated");
								}
							})
						}
					}
				} else {
					console.log("could not find user")
				}

			})
	}
}
})()