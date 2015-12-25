var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
	created_at: {
		type:Date,
		default: Date.now
	},
	updated_at: {
		type:Date,
		default: Date.now
	},
	name: {
		type: String,
		trim: true
	},
	password:{
		type:String
	},
	cSocketID: String,
	phoneNumber: Number,
	friends: [{
			type: Schema.Types.ObjectId,
			ref: 'User',
		}],
	chatrooms: [{
		type: Schema.Types.ObjectId,
		ref: 'Chatroom'
	}],
	newMessage: {
		type: Boolean,
		default: false
	}
});
mongoose.model('User',UserSchema);
UserSchema.path('phoneNumber').required(true);
UserSchema.path('password').required(true);
UserSchema.path('name').required(true);
