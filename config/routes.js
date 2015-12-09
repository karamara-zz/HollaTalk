var users = require('./../server/controllers/users.js');
console.log("routes")
// these redirects the http request to the controller so it can save to mongoDB using model.
module.exports = function(app){
	app.post('/logIn', function(req,res){
		console.log("post to new user", req.body)
		users.create(req, res)
	} );
	app.post('/newFriend', function(req, res){
		console.log("post to add new friend", req.body);
		users.addFriend(req,res)
	})
	app.get('/friendsList/:userPhoneNumber', function(req,res){
		console.log("tyring to fetch friends list for user", req.params);
		users.show(req,res);
	})
}