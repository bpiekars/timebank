var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose'); // package to salt and hash password

var User = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
    firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	location: String,
	timeBalance: { type: Number, default: 24 },
	id: Number
});

User.plugin(passportLocalMongoose); // salt and hash model

modules.export = mongoose.model('User', User);