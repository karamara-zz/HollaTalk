var mongoose = require('mongoose');
var User = mongoose.model("User");
var users = require('./users.js');
module.exports = (function() {
	return {
	show: function(req,res){
		// console.log("fetching friend list for "+ req.params);
		// console.log(req.params);
		User.findOne({_id: req.params.id})
		.populate({
			path: 'friends',
			populate: {path: 'friend'}
			}
			)
		.exec(function (err, user){
			if (user){
				console.log("friends list successfully populated", user);
				res.json({status: true, user: user});
			} else {
				// console.log("there was error");
			}
		})
	},
	find: function(data, socket){
		console.log("finding the friend who user wants to talk", data);
		User.findOne({phoneNumber: data.phoneNumber})
			.populate('friends')
			.exec(function(err, user){
			if (err){
				console.log("there was error")
			} else {
				// console.log("user found ", user)
				socket.emit("receiver", user);
				// for (var friend = 0; friend < user.friends.length; friend++){
				// 	if (user.friends[friend].cSocketID){
				// 		io.sockets.connected[user.friends[friend].cSocketID].emit('updateFriendList')
				// 	}
					console.log(1, user.friends[friend].cSocketID)
				// }
			}
		})
	},
	create: function(req, res){
		console.log("adding "+ req.body.friendPhoneNumber+ " as a friend of "+ req.body.phoneNumber) ; 
		User.findOne({phoneNumber: req.body.phoneNumber}, function(err, friend){
			// console.log(friend, "friend returned by finding one");
			if (err || friend === null){
				// console.log("there was error",err, friend)
				res.json({status: false, error: "the friend does not exist"})

			} else {
				// console.log("the friend found adding a friend to the user")
				User.findOne({_id: req.params.id}, function(err, user){
					if (err){
						// console.log("there was error finding user", err)
					} else {
						// console.log("user found");
						for (var idx = 0; idx < user.friends.length; idx++){
							// console.log("finding if friend already exist")
							// console.log(user.friends[idx],"friends id",friend._id)
							if (String(user.friends[idx]) == String(friend._id)){

								var friendExist = true;
							}
						}
						if (!friendExist){
							user.friends.push(friend);
							user.save(function(err){
								if (err){
									// console.log("error");
	 							} else {
	 								res.json({status: true});
	 							}
							})
						} else {
							res.json({status: false, error: "friend already exists in the friend list of the user"})
						}
					}
				})
			}
		})
	}

}
})()