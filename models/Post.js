var mongoose = require('mongoose');

// Database schema for a post
var PostSchema = new mongoose.Schema({
	name: String,
	text: String, // Text body of post
	time: { type : Date, default: Date.now } // Log date posted
});

// Export Post database model
module.exports = mongoose.model('Post', PostSchema);