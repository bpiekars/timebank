var mongoose = require('mongoose');
//class UserC {
	//constructor(){
	//this.UserSchema = new mongoose.Schema({
var PostSchema = new mongoose.Schema({
	text: String
});

module.exports = mongoose.model('Post', PostSchema);