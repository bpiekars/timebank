/*const handler = (req, res) => res.send(path.join(__dirname), 'public/index.html');
const routes = ["/", "/login", "/register"];
routes.forEach(route => app.get(route, handler));

/*app.get('/login', (req, res) => {
    res.sendfile(__dirname + '/public/login.html');
})*/
/*
var appl = angular.module('timebank', ['ngMaterial']);
appl.controller('SidenavController', ($scope, $mdSidenav) => {
    $scope.openLeftMenu = () => {
        $mdSidenav('left').toggle();
    };
});*/
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var express = require('express');
var server = express.Router();
var bcrypt = require('bcryptjs');
//var pug = require('pug');
//var methodOverride = require('method-override');
//var db = require('./config/db');
var User = require('./models/User.js');
var Post = require('./models/Post.js');
//mongoose.connect(db.url);
//var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
var app = express();
app.use(expressValidator());
// set application port to 8080
app.set('port', 8080);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// Check if user is logged in
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/feed_2');
    }
    else {
        next();
    }
};

// route for the homepage
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

// Register a user
app.route('/register')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname +'/public/register.html');
    })
    .post((req, res) => {
        var url = 'mongodb://localhost:27017/timebank';

        var db = mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true }, function(err, db) {
            if(err){
                console.log(err);
            }
            else {
                console.log("MongoDB connection successfully established to url: " + url);
                mongoose.connection.close();
                console.log("Connection status: " + mongoose.connection.readyState);
            }
        });
		console.log('User input:');
        console.log(req.body);
		
		// Form Validator
		req.checkBody('password_conf',"Passwords do not match").equals(req.body.password);
		var errors = req.validationErrors();
		
		if (errors) {
			console.log("Passwords do not match");
			res.sendFile(__dirname + "/public/registerfailure.html");
		} else {
		bcrypt.hash(req.body.password, 10, function(err, hash){
		var userData = {
			email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            location: req.body.location,
			password: hash
		};
		console.log('Saved to database:');
		console.log(userData);
		User.create(userData, function(err, user) {
			if (err) {
				if (err.name === 'MongoError' && err.code === 11000) {
				// Duplicate username
				console.log('User already exists');
				res.redirect('/registerfailure2.html');
				}
			}
			else {
				// if there's no error, redirect to feed dashboard
				req.session.user = user.dataValues;
				res.redirect('/feed_2');
			}
		});
		});
		}
	});

// Login a user
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        var url = 'mongodb://localhost:27017/timebank';
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
        User.findOne({'email': req.body.email, 'password': req.body.password}, (err, user) => {
            if (err) {
                console.log("User does not exist");
                res.sendFile(__dirname + "/public/loginfailure.html");
            }
            else {
				bcrypt.hash(req.body.password, 10, function(err, hash){
					var userData = {
						email: req.body.email,
						password: hash
					};
				});
				bcrypt.compareHashSync(req.body.password, hash, function (err, result) {
					if (result) {
						console.log('Correct password');
						res.redirect('/feed_2');
					} else {
						console.log("Incorrect password");
						res.sendFile(__dirname + "/public/loginfailure.html");
					}
				});
                console.log("FOUND");
                req.session.user = user.dataValues;
                res.redirect('/feed_2');
            }
            /*else {
              req.session.user = user.dataValues;
              res.redirect('/feed');
            } */
        });
    });

// Make a post and save to database
app.route('/post')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname +'/public/feed2_success.html');
    })
    .post((req, res) => {
        var url = 'mongodb://localhost:27017/timebank';

        var db = mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true }, function(err, db) {
            if(err){
                console.log(err);
            }
            else {
                console.log("MongoDB connection successfully established to url: " + url);
                mongoose.connection.close();
                console.log("Connection status: " + mongoose.connection.readyState);
            }
        });
		console.log('Post text:');
        console.log(req.body);
		
		var postData = {
			message: req.body.message
		};
		console.log('Saved to database:');
		console.log(postData);
		Post.create(postData, function(err, user) {
			if (err) {
				console.log('Post unsuccessful');
				res.redirect('/feed_2.html');
			}
			else {
				// if there's no error, redirect to feed dashboard
				console.log('Post successful');
				res.redirect('/feed_2_success.html');
      }
    });
    });

// Route to homepage
app.get('/feed_2', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/feed_2');
        res.sendFile(__dirname + "/public/feed_2.html");
    }
    else {
        res.sendFile(__dirname + "/public/feed_2.html");
    }
});

// GET /logout
app.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
		res.clearCookie('user_sid');
		console.log('User logged out');
		res.sendFile(__dirname + "/public/logout.html");
      }
    });
  }
});

app.use(function (req, res, next) {
    res.status(404).send("Page unavailable");
});

app.listen(app.get('port'), () => console.log('App started'));