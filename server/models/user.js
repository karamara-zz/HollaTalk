var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	name: String,
	phoneNumber: Number
});
mongoose.model('User',UserSchema);