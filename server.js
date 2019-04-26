//import mongoose from 'mongoose';

const express = require('express'); // import express moodule
const mongoose = require('mongoose'); // import mongoose module
const path = require('path'); // import nodejs path module for working with files and directories
/* var routes = require('./routes/index');
var users = require('./routes/users'); */ // not sure what these lines are for
var bodyParser = require('body-parser');

var url = "mongodb://localhost:27017/timebank"; // global variable mongodb url, currently local database
var app = express(); // initialize express application

// initialize express router and tell web server to listen on port 8080
var port = process.env.PORT || 8080; // set port to whatever PORT value is or 8080 if not available
var router = express.Router()
//var db = require('./config/db'); // haven't yet setup db config file

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// server images, css, html files in directory public
app.use(express.static('public'));
/*var db = mongoose.connect("mongodb://localhost:27017/dumaaksjkahsjkhas");
var mod = new mongoose.Schema({name: String});
var Mod = mongoose.model('Mod', mod);
Mod.create({name: "Adam"}, function(err, doc) {});*/
/*
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
*/

// Conenct to MongoDB and check connection
mongoose.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err){
  	console.log(err);
  }
  else {
  	console.log("MongoDB connection successfully established to url: " + url);
  	mongoose.connection.close();
  	console.log("Connection status: " + mongoose.connection.readyState);
  }
})

var mod = new mongoose.Schema({
  email: String,
  firstname: String,
lastname: String,
location: String,
password: String
});
var Mod = mongoose.model('Mod', mod);


// deliver index.html file to be viewed default at port 8080
const handler = (req, res) => res.send(path.join(__dirname), 'public/index.html');
//angular js routes, root, login, register
const routes = ["/", "/login", "/register"];
// for each route, use route handler to direct to index
routes.forEach(route => app.get(route, handler));


// Register user information added to DB here
app.post('/register', (req, res) => {
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
    console.log(req.body);
  Mod.create({
    /*email: req.body.email,*/ email: 'fuck',
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    location: req.body.location,
    password: req.body.password
  });
  res.sendFile('/register.html');
  //console.log(req.body.email);
  
})


// web server listens on specificed port 8080
app.listen(port);

