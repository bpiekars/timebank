var mongoose = require('mongoose');

//class UserC {
	//constructor(){
	//this.UserSchema = new mongoose.Schema({
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    useCreateIndex: true,
    required: true,
    trim: true
  },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	location: String,
  password: {
    type: String,
    required: true
  },
	timeBalance: { type: Number, default: 24 },
	id: { type: Number }
});

module.exports = mongoose.model('User', UserSchema);
//var UserMod = mongoose.model('UserMod', UserSchema);
//module.exports.UserMod = UserMod;
//module.exports.User = mongoose.model('UserMod', UserSchema);
//}
//}