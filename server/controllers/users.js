var mongoose = require('mongoose');
var User = mongoose.model("User");
module.exports = (function() {
	return {
	create : function(req,res){
		console.log(req.body);
		var newUser = new User(req.body)
		newUser.save(function(err){
			if (err){
				// what will do if eror occurs
				console.log("there was error saving the user")
			} else {
				console.log("no error saving")
				res.json({status: true})
				// pass back the status equal to true to confirm that saving was completed without error
			}
		})
	}
}
})()