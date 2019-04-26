/*var express = require('express');
var pug = require('pug');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var mongoose = require('mongoose');

//var db = require('./config/db');

var port = process.env.PORT || 8080;
var router = express.Router()

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public'))

//server.js
//mongoose.connect(db.url);

/*app.get('/', function(req, res) {
    res.render('log.html');
}); */



/*const handler = (req, res) => res.send(path.join(__dirname), 'public/index.html');
const routes = ["/", "/login", "/register"];
routes.forEach(route => app.get(route, handler));

/*app.get('/login', (req, res) => {
    res.sendfile(__dirname + '/public/login.html');
})*/
/*app.listen(port);

var appl = angular.module('timebank', ['ngMaterial']);
appl.controller('SidenavController', ($scope, $mdSidenav) => {
    $scope.openLeftMenu = () => {
        $mdSidenav('left').toggle();
    };
});*/
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();


var mod = new mongoose.Schema({
    email: String,
    firstname: String,
    lastname: String,
    location: String,
    password: String
});
var Mod = mongoose.model('Mod', mod);

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

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

// Register a user

app.route('/register')
    .get(sessionChecker, (req, res) => {
        //res.sendfile(__dirname + '/public/register.html');
        res.sendfile(__dirname +'/public/register.html');
    })
    .post((req, res) => {
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
            /*email: req.body.email,*/ email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            location: req.body.location,
            password: req.body.password
        });
        req.session.user = user.dataValues;
        res.redirect('/feed_2');
    });

// Login a user

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendfile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
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
        Mod.findOne({'email': req.body.email, 'password': req.body.password}, (err, user) => {
            if (err) {
                console.log("Could not find");
                res.redirect('/login');
                console.log("NOT FOUND");
                //return;
            }
            else {
                console.log("FOUND");
                req.session.user = user.dataValues;
                res.redirect('/feed_2');
            }
            /*else {
              req.session.user = user.dataValues;
              res.redirect('/feed');
            } */
        })
    });

// Route to homepage

app.get('/feed_2', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/feed_2');
        res.sendfile(__dirname + "/public/feed_2.html");
    }
    else {
        res.sendfile(__dirname + "/public/feed_2.html");
    }
});

app.use(function (req, res, next) {
    res.status(404).send("Page unavailable")
});

app.listen(app.get('port'), () => console.log('App started'));