var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	text: String
});

module.exports = mongoose.model('Post', PostSchema);