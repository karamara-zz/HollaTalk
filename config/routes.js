var users = require('./../server/controllers/users.js');
console.log("routes")
// these redirects the http request to the controller so it can save to mongoDB using model.
module.exports = function(app){
	app.post('/newUser', function(req,res){
		console.log("post to new user", req.body)
		users.create(req, res)
	} )
}