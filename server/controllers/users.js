var mongoose = require('mongoose');
var User = mongoose.model("User");
module.exports = (function() {
	return {
	create : function(req,res){
		// it will check if user's phone number already exist and returns error message if they do
		User.findOne({phoneNumber : req.body.phoneNumber}, function(err, user){
			console.log("checking if the user already exist")
			if (user){
				console.log("users already exists")
				res.json({status: false, error: "user already exists"})
			} else if (err) {
				console.log("there is error finding the user");
				res.json({statis: false, error: err});
			}else {
				console.log(req.body);
				var newUser = new User(req.body)
				newUser.created_at = Date.now();
				newUser.updated_at = Date.now();
				newUser.save(function(err){
					if (err){
						// what will do if eror occurs
						res.json({status: false, error: err})
						console.log("there was error saving the user")
					} else {
						console.log("no error saving")
						res.json({status: true})
						// pass back the status equal to true to confirm that saving was completed without error
					}
				})
			}
		})

	},
	show: function(req,res){
		console.log("fetching friend list for "+ req.params.userPhoneNumber);
		User.findOne({phonNumber: req.params.userPhoneNUmber})
		.populate('friends')
		.exec(function (err, friendsList){
			if (err){
				console.log("there was error populating friendsList");
			} else {
				console.log("friends list successfully populated");
				res.json(friendsList);
			}
		})

	},
	addFriend: function(req, res){
		console.log("adding "+ req.body.friendPhoneNumber+ " as a friend of "+ req.body.phoneNumber) ; 
		User.findOne({phoneNumber: req.body.friendPhoneNumber}, function(err, friend){
			console.log(friend, "friend returned by finding one");
			if (err || friend === null){
				console.log("there was error")
				res.json({status: false, error: "the friend does not exist"})

			} else {
				console.log("the friend found adding a friend to the user")
				User.findOne({phoneNumber: req.body.phoneNumber}, function(err, user){
					if (err){
						console.log("there was error finding user")
					} else {
						console.log("user found");
						user.friends.push(friend);
						user.save(function(err){
							if (err){
								console.log("error");
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