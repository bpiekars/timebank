var path = require('path');
var stream = require('getstream-node');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var express = require('express');
var server = express.Router();
var bcrypt = require('bcryptjs');
var User = require('./models/User.js');
var Post = require('./models/Post.js');

// Initialize express app
var app = express();

let FeedManager = stream.FeedManager;


// Express middleware for validation and req.body error checking
app.use(expressValidator());

// Set application port to 8080
app.set('port', 8080);

var PostS = new mongoose.Schema({
	name: String,
	text: String, // Text body of post
	time: { type : Date, default: Date.now } // Log date posted
});

var PostM = mongoose.model('PostM', PostS);



//postSchema.plugin(stream.mongoose.activity);

stream.mongoose.setupMongoose(mongoose);

// Tell express to parse user input as req.body
app.use(bodyParser.urlencoded({
    extended: true
}));

// Tell express to serve static html files under the public directory
app.use(express.static(__dirname + '/public'));

// Parse and store browser cookies to handle user sessions
app.use(cookieParser());

// Initialize express session with key, secret, only creates session for users who login or register, cookies automatically expire 
app.use(session({
    key: 'user_sid', // session key
    secret: 'secret', // session secret string
    resave: false,
    saveUninitialized: false, // only create session for users who login or register
    cookie: {
        expires: 600000 // set cookies to automatically expire 
    }
}));

// Check if user cookies are still stored in browser while user not set, if so automatically logs the user out.
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
    } else {
        next();
    }
};

// Route index to login page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

// Route handling to register a user
app.route('/register')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/register.html');
    })
    .post((req, res) => {
        var url = 'mongodb://localhost:27017/timebank'; // database address
        // Test mongoose connection to database, catch and log error if connection fails
        var db = mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true
        }, function(err, db) {
            if (err) {
                console.log(err);
            }
            // if no errors, successfully connected to database and log connection details
            else {
                console.log("MongoDB connection successfully established to url: " + url);
                mongoose.connection.close(); // not currently reading or writing to database, so close connection
                console.log("Connection status: " + mongoose.connection.readyState);
            }
        });
        // Log user input to console
        console.log('User input:');
        console.log(req.body);

        // Form Validator
        req.checkBody('password_conf', "Passwords do not match").equals(req.body.password);
        var errors = req.validationErrors();

        // If password and password confirmation don't match, inform user of error and return to registration
        if (errors) {
            console.log("Passwords do not match");
            res.sendFile(__dirname + "/public/registerfailure.html");
        } else {
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                var user = User.create({
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    location: req.body.location,
                    password: hash
                }, function(err, user) {
                    if (err) {
                        if (err.name === 'MongoError' && err.code === 11000) {
                            console.log('User already exists'); // Duplicate email found
                            res.redirect('/registerfailure2.html'); // Tell user that email already found, redirect to registry
                        }
                    } else {
                        // if there's no error, redirect to feed dashboard
                        // Log user data as will be saved to database
                        console.log('Saved to database:');
                        console.log(user);
                        req.session.user = user.dataValues; // initialize the current session for the current user with the entered values
                        res.redirect('/feed_2');
                    }
                });
            });
        }
    });

// Route handling to login a user
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        var url = 'mongodb://localhost:27017/timebank'; // database address
        // Test mongoose connection to database, catch and log error if connection fails
        var db = mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true
        }, function(err, db) {
            if (err) {
                console.log(err);
            }
            // if no errors, successfully connected to database and log connection details
            else {
                console.log("MongoDB connection successfully established to url: " + url);
                mongoose.connection.close(); // not currently reading or writing to database, so close connection
                console.log("Connection status: " + mongoose.connection.readyState);
            }
        });
        // Log user input to console
        console.log('User input:');
        console.log(req.body);
        // Query database to find a document that contains both user input email and password
        User.findOne({
            'email': req.body.email,
        }, (err, user) => {
            // If an error occurs, user with email and password not found
            if (err) {
                console.log(err);
            }
            if (!user) {
                console.log("User does not exist");
                res.sendFile(__dirname + "/public/loginfailure.html"); // inform user that user was not found in database
            } else {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if (err) {
                        console.log(err);
                        res.redirect('/loginfailure'); // Redirect user to the login failure page
                    }
                });
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                    // If result is true, the passwords match
                    if (result) {
                        // If no error found and passwords match, then user is found
                        console.log('Correct password');
                        console.log(user);
                        console.log("FOUND");
                        req.session.user = user.dataValues; // create session for user using input vales
                        res.redirect('/feed_2'); // redirect user to the feed
                    } else {
                        console.log("Incorrect password"); // If result is false, passwords do not match
                        res.sendFile(__dirname + "/public/loginfailure.html"); // Redirect user to login failure page
                    }
                });
            }
        });
    });
// Make a post and save to database
app.route('/post')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/feed2_success.html');
    })
    .post((req, res) => {
        var url = 'mongodb://localhost:27017/timebank'; // database address
        // Test mongoose connection to database, catch and log error if connection fails
        var db = mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true
        }, function(err, db) {
            if (err) {
                console.log(err);
            }
            // if no errors, successfully connected to database and log connection details
            else {
                console.log("MongoDB connection successfully established to url: " + url);
                mongoose.connection.close(); // not currently reading or writing to database, so close connection
                console.log("Connection status: " + mongoose.connection.readyState);
            }
        });
        // Log post text to console
        console.log('Post text:');
        console.log(req.body);

        // Set post data to input text
        /*var postData = {
            user: "a",
            message: "l"
            //message: req.body.message
        }; */
        // Log data to be saved to database to console\
        //console.log(postData);
        var postData = new PostM({
            name: "user",
            text: req.body.message
        });
        // Create Post document using input text as post data
        PostM.create(postData, function(err) {
            if (err) {
                // If an error posting occurs, log to console and redirect back to feed page
                console.log('Post unsuccessful');
                res.redirect('/feed_2.html');
            } else {
                // If no error occurs, log success to console and redirect back to feed page (with new post added to top of feed)
                console.log('Post successful');
                res.redirect('/feed_2success.html');
            }
        });
    });
// GET route to feed
app.get('/feed_2', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        // if existing user session and cookies found, clear them and redirect to feed
        res.clearCookie('user_sid');
        // redirect to feed anyway
        res.sendFile(__dirname + "/public/feed_2.html");
    } else {
		// redirect to feed anyway
        res.sendFile(__dirname + "/public/feed_2.html");
	}
	/* else {
        console.log('Error: no user session found. Please login again');
        res.sendFile(__dirname + "/public/loginfailure2.html");
    } */
});
// GET route for HTTP logout request
app.get('/logout', (req, res) => {
    if (req.session) {
        // delete user session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                res.clearCookie('user_sid'); // clear cookies for current user session
                console.log('Session cookies cleared.');
                console.log('User logged out.');
                res.sendFile(__dirname + "/public/logout.html"); // redirect to login page, informing user they've been signed out
            }
        });
    }
});
function ensureAuthenticated(req, res, next) {
    return next();
  }


app.get('/flat', ensureAuthenticated, function(req, res, next){
    req.user.id = "1";
    var flatFeed = FeedManager.getNewsFeeds(req.user.id)['flat'];
 
    flatFeed.get({})
    	.then(function (body) {
        	var activities = body.results;
        	return StreamBackend.enrichActivities(activities);
        })
        .then(function (enrichedActivities) {
            return res.render('feed', {location: 'feed', user: req.user, activities: enrichedActivities, path: req.url});
        })
        .catch(next)
    });

/*
app.controller("MainController", function($scope) {
    //console.log('help');
    $scope.product = "dddddddddd";
    //var url = "mongodb://localhost:27017/timebank";
    //var db = mongoose.connect(url, {useNewUrlParser: true});
    //var Post = mongoose.model('Post', {
        //email: String,
        //text: String
    //});
    var strings = ["I posted this", "I posted that", "I posted another thing."]
    var finalHTML = "";
    for (x in strings) {
        //finalHTML += "<div class='row'><div class='col-md-3'><div class='card'><div class='card-body'><div class='h5'>" + "use!" + "</div><div class='h7 text-muted'>"+ x + "</div></div></div></div>";
        //finalHTML += "<div>hello!!</div>";
    }
    /*Post.find({}, (err, posts) => {
        if (err) {
            console.log("error mongo!");
        }
        else {
            posts.map(user => {
                finalHTML += "<p>" + user.text + "</p>";
            })
        }
    })*/
    /*$scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    }*/
    /*$scope.product = finalHTML;
});
*/ 

/*var Post = mongoose.model('Post', {
    email: String,
    text: String
});*/

    app.get('/feed_data', (req, res) => {
        var finalHTML = "";
        console.log("HERE");
        var url = "mongodb://localhost:27017/timebank";
        var db = mongoose.connect(url, {useNewUrlParser: true});
        PostM.find({name: "user"}, (err, posts) => {
            console.log(JSON.stringify(posts));
            if (err) {
                console.log("error mongo!");
                console.log("error!");
            }
            else {
                console.log(JSON.stringify(posts));
                posts.map(p => {
                    console.log(p)
                    console.log("p string:" + JSON.stringify(p));
                    finalHTML += "<p>" + p.text + "</p>";
                    console.log(p.message);
                });
                //console.log(JSON.stringify(posts));
            }
            res.send(finalHTML);
        });
    });
        //console.log(finalHTML);
        


// handler for HTTP 404 error: page not found
app.use(function(req, res, next) {
    res.status(404).send("Page unavailable");
});
// app starts listening for connections on port 8080
app.listen(app.get('port'), () => console.log('App started'));
