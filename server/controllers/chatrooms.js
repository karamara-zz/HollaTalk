var mongoose = require('mongoose');
var Chatroom = mongoose.model("Chatroom");
module.exports = (function(){
	return{
		create: function(req, res){
			// it will create the chatroom, when user first start the chat.. 
			// to avoid extra work everytime a user message, there could be the status in the json file that will tell the system if there is chatroom alreay created. it coudl check on front end.
			// but still have to  check if the data exists or not.
			Chatroom.findOne({users: req.body.sendFrom, users:req.body.sendTo}, function(err, chatroom){
				if (err){
					console.log("there was error");
				} else if (chatroom) {
					console.log("chatroom exist something wrong with the system");
				} else {
					var sentFrom;
					var sendTo;
					User.findOne({ _id : req.body.sentFrom
					}, function( err, user){
						if (err){
							console.log("there was error");
						} else {
							sentFrom = user;
						}
					})
					User.findOne({ _id : req.body.sendTo
					}, function( err, user){
						if (err){
							console.log("there was error");
						} else {
							sendTo = user;
						}
					})
					var newMessage = {
						message: req.body.message,
						created_at: Date.now()
					};
					var chatroomData = {
						users: [ sentFrom, sendTo],
						messages:[newMessage],
						created_at: Date.now(),
						updated_at: Date.now()
					};
					var newChatroom = new Chatroom(chatroomData);
					newChatroom.save(function(err){
						if (err){
							res.json({status: false, error: err});
						} else {
							res.json(newChatroom);
						};
					});
				};
			});
		}, //end of the create method
		update: function(req, res){
			// need req.body to contain { chatroomId : _id , message: String , sender: String(user id)}
			console.log("updating the chatroom id ", req.params);
			var newMessage = {
				sender: req.body.sender,
				message: req.body.message
			}
			Chatroom.findOne({_id : req.params}, function(err, chatroom){
				if (err) {
					console.log("there was error finding chatroom");
				} else {
					var tempArr = chatroom.messages;
					tempArr.push(newMessage);
					chatroom.messages = tempArr;
					chatroom.save(function(err){
						if (err){
							console.log("there was error saving the chatroom")
						} else {
							res.json(chatroom);
						};
					});

				};
			});
		}// end of update method
	};// end of the return object
});