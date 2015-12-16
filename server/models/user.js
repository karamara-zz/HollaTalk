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
	cSocketID: String,
	phoneNumber: Number,
	friends: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
	chatrooms: [{
		type: Schema.Types.ObjectId,
		ref: 'Chatroom'
	}]
});
mongoose.model('User',UserSchema);
UserSchema.path('phoneNumber').required(true);
UserSchema.path('name').required(true);
