var mongoose = require('mongoose')
var fs = require('fs')
// mongoose.connect('mongodb://localhost/hollaTalk')
mongoose.connect('mongodb://user1:dkssud1@ds057954.mongolab.com:57954/heroku_754s2lbl')
var models_path = __dirname + '/../server/models';
fs.readdirSync(models_path).forEach(function(file){
	if (file.indexOf('.js') > 0) {
		require(models_path + '/' + file);
	}
});