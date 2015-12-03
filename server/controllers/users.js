var mongoose = require('mongoose');
var User = mongoose.model("User");
module.exports = (function() {
	return {
	create : function(req,res){
		// it will check if user's phone number already exist and returns error message if they do
		User.findOne({phoneNumber : req.body.phoneNumber}, function(err, user){
			console.log("checked if the user already exist")
			if (user){
				console.log("users already exists")
				res.json({status: false, error: "user already exists"})
			}else {
				console.log(req.body);
				var newUser = new User(req.body)
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

	}
}
})()