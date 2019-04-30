var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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

UserSchema.methods.generateHash = function (password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// check if password is valid by loading hash from db and checking if entered password equals unhashed password
UserSchema.methods.validPassword = function (password){
	//return bcrypt.compareSync(password, this.localPassword);
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
//var UserMod = mongoose.model('UserMod', UserSchema);
//module.exports.UserMod = UserMod;
//module.exports.User = mongoose.model('UserMod', UserSchema);
//}
//}