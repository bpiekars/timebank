var express = require('express');
var pug = require('pug');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//var db = require('./config/db');

var port = process.env.PORT || 8080;

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public'))

// mongoose.connect(db.url);

app.get('/', function(req, res) {
    res.render('index.html');
});

app.listen(port);