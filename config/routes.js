var users = require('./../server/controllers/users.js');
var chatrooms = require('./../server/controllers/chatrooms');
console.log("routes")
// these redirects the http request to the controller so it can save to mongoDB using model.
// // it would be good idea to make RESTful route for friend and the user.!!
module.exports = function(app){
	// app.get('/',function(req,res){
	// 	console.log("home");
	// })
	app.post('/logIn', function(req,res){
		console.log("logging in", req.body)
		users.logIn(req, res)
	});
	app.get('/session', function(req, res){
		console.log("post request for session called", req.body);
		users.session(req, res);
	})
	app.post('/newFriend', function(req, res){
		console.log("post to add new friend", req.body);
		users.addFriend(req,res)
	});
	app.get('/friendsList/:userPhoneNumber', function(req,res){
		console.log("tyring to fetch friends list for user", req.params);
		users.show(req,res);
	});

	// user routes
    // Index
	.get('/users', function(request, response) {
		users.index(request, response)
	});

	.get('/users/new', function(request, response) {
		users.create(request, response)
	});

	.get('/users/:id', function(request, response) {
		users.show(request, response)
	});

	.get('/users/:id/edit', function(request, response) {
		users.update(request, response)
	});

	.post('/users', function(request, response) {
		users.create(request, response)
	});
	// .put('/users/:id', function(req, res){
	// 	//update the user information won't use it until finish up.
	// });
	app.delete('users/:id', function(req, res) {
		// delete the user available when admin feature is built
	});

	// chat room routes
	app.post('/newChatroom', function(req, res){
		console.log("new chatroom is being created");
		chatrooms.create(req, res);
	});
	app.post('/newMessage', function(req, res){
		console.log("new message is being updated");
		chatrooms.update(req, res);
	});

}