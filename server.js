var express = require('express');
var pug = require('pug');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//var db = require('./config/db');

var port = process.env.PORT || 8080;
var router = express.Router()

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public'))

// mongoose.connect(db.url);

/*app.get('/', function(req, res) {
    res.render('log.html');
}); */
/*
const handler = (req, res) => res.send(path.join(__dirname), 'public/index.html');
const routes = ["/", "/login"];
routes.forEach(route => app.get(route, handler));
*/
app.get('/login', (req, res) => {
    res.sendfile(__dirname + '/public/login.html');
})
app.listen(port);