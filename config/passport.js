var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
	var FACEBOOK_APP_ID = "1633849926909871";
	var FACEBOOK_APP_SECRET = "b4724d959b94fed404bd87c9600c2f25";

	// serialize and deserialize
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});
	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	passport.use(new FacebookStrategy({
	    clientID: FACEBOOK_APP_ID,
	    clientSecret: FACEBOOK_APP_SECRET,
	    callbackURL: "http://localhost:3000/auth/facebook/callback"
	  },
	  function(accessToken, refreshToken, profile, cb) {
	  	console.log(profile);
	    User.findOrCreate({ id: profile.id, displayName: profile.displayName}, 
	    	function (err, user) {
	    	console.log("user>>>>");
	    	console.log(user);
	    	return cb(err, user);
	    });
	  }
	));

};
