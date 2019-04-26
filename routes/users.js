var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy();

var User = require('../models/user');
app.use(express.static(path.join(__dirname, 'public')));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register.html', function(req, res, next) {
  res.render('register');
});

router.get('/login.html', function(req, res, next) {
  res.render('login');
});

router.post('/login.html',
	passport.authenticate('local',{failureRedirect: '/users/login', falureFlash: 'Invalid email or password'}),
	function(req, res){
	// if this function gets called, authentication was scuccessful
	// 'req.user' contains authenticated user.
	req.flash('success', 'You are now logged in');
	res.redirect('/');
	//res.//redirect('/users/' + req.user.email);
});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user){
		done(err,user);
	});
});

passport.use(new LocalStrategy(function(email, password, done){
	User.getUserByUsername(email, function(err, user){
		if (err) throw err;
		if (!user){
		return done(null, false, {message: 'unknown user'})};

		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) return done(err);
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid password'});
			}
		});
	});
}));

router.post('/register.html', upload.single('image') , function(req, res, next) {
	var email = req.body.email;
	var firstName = req.body.firstname;
	var lastName = req.body.lastname;
	var password = req.body.password;
	var password_conf = req.body.password_conf;

	console.log(req.file);
	if(req.file){
		console.log('Uploading File...');
		var profileimage = req.file.filename;
	} else {
		console.log('No file uplaoded');
		var profileimage = 'default-profile.png';
	}
    
    // Form Validator
    req.checkBody('email','Email address is required').notEmpty();
    req.checkBody('email','Email address is invalid').isEmail();
	req.checkBody('firstName','First name field is required').notEmpty();
	req.checkBody('lastName','Last name field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('passwordconf',"Passwords do not match").equals(req.body.password);


	// Check Errors
	var errors = req.validationErrors();

	// add html
	// if errors each error, i in errors li.alert.alert=danger #{error.msg}
	if(errors){
		console.log('error');
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			email: email,
			firstName: firstname,
			lastName: lastname,
			password: password,
			profileimage: profileimage
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success', 'You are now registered and can login');
		res.location('/');
		res.redirect('/');
	}
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('sucess', 'You are now logged out');
	res.redirect('/users/login');
});

module.exports = router;
