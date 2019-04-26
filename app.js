var express = require('express'); // import express module
var path = require('path'); // import path module
var logger = require('morgan'); // import morgan module, http request logger
var cookieParser = require('cookie-parser'); // import cookie-paser module, allowing simple signed cookie parsing 
var bodyParser = require('body-parser'); // import body-parser module, middleware to store and parse json, buffer, string, url data as http post
var passport = require('passport'); // import passport express module, allows authentication strategies
var mongoose = require('mongoose'); // import mongoose module
var flash = require('connect-flash');
var session = require('express-session');
//var routes = require ('./routes/routes')(app); // import routes

global.url = 'mongodb://localhost:27017/timebank';
// initialize express app
var app = express();

// initialize mongodb using config
//var db = require('./config/db').mongoURI;

// initialize express router and set port to 8080
var port = process.env.PORT || 8080;
var router = express.Router()

// default pages in public directory
app.use(express.static('public'));

// tel app to use pug engine, apps view folder public directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public'));

// Connect to MongoDB and check connection status
mongoose.connect(url, { useNewUrlParser: true }, function(err,db){
	if(err){
		console.log(err);
	} else {
		console.log('MongoDB connection successfully established at: ' + url + ' with status: ' + mongoose.connection.readyState);
	}
});

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secretstring',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// deliver index.html file to be viewed default at port 8080
var handler = (req, res) => res.send(path.join(__dirname), 'index.html');
// angular js routes, root, login, register
var routes = ["/", "/login", "/register"];
// for each route, use route handler to direct to index
routes.forEach(route => app.get(route.handler));
// web server listens on specificed port
//app.listen(port);
app.listen(port, console.log(`Server started on port ${port}`));

/* var app = angular.module('timebank', ['ngMaterial']);
app.controller('SidenavController', ($scope, $mdSidenav) => {
    $scope.openLeftMenu = () => {
        $mdSidenav('left').toggle();
    };
});
*/