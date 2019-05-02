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
});

// Export User database model
module.exports = mongoose.model('User', UserSchema);
