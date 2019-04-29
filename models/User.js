var mongoose = require('mongoose');

class User {
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
})
	
	var UserMod = mongoose.model('User', UserSchema);
});

module.exports = UserMod;