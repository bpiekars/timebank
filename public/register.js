const mongoose = require('mongoose')

var url = 'mongodb://localhost:27017/timebank'

var db = mongoose.connect(url, { useNewUrlParser: true }, function(err, db) {
    if(err){
        console.log(err);
    }
    else {
        console.log("MongoDB connection successfully established to url: " + url);
        mongoose.connection.close();
        console.log("Connection status: " + mongoose.connection.readyState);
    }
  });
var mod = new mongoose.Schema({
    email: String,
    firstname: String,
lastname: String,
location: String,
password: String
});
var Mod = mongoose.model('Mod', mod);
{}