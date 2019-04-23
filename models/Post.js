var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create Schema and Model
var Post = new Schema({
	img : { data: Buffer, imgType: String },
	body: String,
	author: String,
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', Post);
