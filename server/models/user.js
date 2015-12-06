var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
	created_at: Date,
	updated_at: Date,
	name: String,
	cSocketID: String,
	phoneNumber: Number,
	friends: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}]
});
mongoose.model('User',UserSchema);
