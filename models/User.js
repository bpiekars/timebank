var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Database schema for a user
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

// Generate salt and hash for password
UserSchema.methods.generateHash = function (password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Check if password is valid by loading hash from db and checking if entered password equals unhashed password
UserSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

/* UserSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compare(plaintext, this.password));
}; */

// Export User database model
module.exports = mongoose.model('User', UserSchema);