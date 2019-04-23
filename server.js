var express = require('express'); // Express is a web application framework for NodeJs
var pug = require('pug');
var path = require('path'); // Node Js path module provides waty
var bodyParser = require('body-parser'); // Express package body-parser parses http post request body
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser'); // package that generates and stores local cookies
var logger = require('morgan'); // Express HTTP logger middleware
var passport = require('passport'); // package used for user authentication in express
var mongoose = require('mongoose'); // Mongoose package required to work with MongoDB
/* var routes = require('./routes/index');
var users = require('./routes/users'); */

var app = express(); // create new express application
//var db = require('./config/db');

var port = process.env.PORT || 8080;
var router = express.Router()

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public'))

// connect to database
var url = 'mongodb://localhost:27017'; // global variable for database location
mongoose.connect(url);
mongoose.connect(url, function(error){
    if(error) console.log(error);
        console.log("Connected to MongoDB!");
});

/*app.get('/', function(req, res) {
    res.render('log.html');
}); */

const handler = (req, res) => res.send(path.join(__dirname), 'public/index.html');
const routes = ["/", "/login", "/register"];
routes.forEach(route => app.get(route, handler));

/*app.get('/login', (req, res) => {
    res.sendfile(__dirname + '/public/login.html');
})*/
app.listen(port);

/*var appl = angular.module('timebank', ['ngMaterial']);
appl.controller('SidenavController', ($scope, $mdSidenav) => {
    $scope.openLeftMenu = () => {
        $mdSidenav('left').toggle();
    };
});*/
