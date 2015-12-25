var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatroomSchema = new mongoose.Schema({
	created_at: {
		type:Date,
		default: Date.now
	},
	updated_at: {
		type:Date,
		default: Date.now
	},
	users: [{
		type: Schema.Types.ObjectId,
		ref: "User"
	}],
	messages: [{
		sender: String,
		message: String
	}]

});
mongoose.model('Chatroom',chatroomSchema);


//chat room that will save messages. it i will have two to many relationship with user. 
//one user will have many messages that will have
// messages in form of array of dictionary that contains both of user's id
// [{user_id(1): message , updated : time}, {user_id(2) : message, updated : time}]
// 