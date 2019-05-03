var mongoose = require('mongoose');

// Database schema for a post
var PostSchema = new mongoose.Schema({
	text: String, // Text body of post
	posted: {
        type: Date,
        default: new Date()
    },
	author: String // Posted by who
});

// Export Post database model
module.exports = mongoose.model('Post', PostSchema);