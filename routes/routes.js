var express = require('express');
var app = express();

/* module.exports = function(app){
    app.get('*',  function(req, res){
        res.sendfile('./public/login.html');
    });
}
*/

// error handler, reroute non-existent GET route to login page
app.get('*', function(req, res){
	res.sendfile('./public/login.html');
});