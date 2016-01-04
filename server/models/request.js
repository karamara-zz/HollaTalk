var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var requestSchema = new mongoose.Schema({
	created_at:{
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	},
	requestFrom : {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	requestTo : {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
})
mongoose.model("Request", requestSchema);