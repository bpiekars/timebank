var mongoose = require('mongoose');
var schema = mongoose.Schema;

class User {
	constructor(){
	this.UserSchema = new Schema({
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
	module.exports = mongoose.model('UserMod', UserSchema);
}
}