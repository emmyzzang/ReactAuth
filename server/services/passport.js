// used to help authenticate a user
// configuration // logic to help setup passport-jwt
// passport helps us authenticate a user when they attempt to visit a route that requires authentication
const passport = require('passport');
const User = require('../models/user');
const config = require('../config'); // Pull in our secret

const JwtStrategy = require('passport-jwt').Strategy;
// passport is an ecosystem formed by strategies
// Passport Strategy #1 -- Verify user with a jwt (jwtLogin)
// Passport Strategy #2 -- Verify user with username and password (localLogin)
// see the website for more details

const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');

const localOptions = {
    usernameField: 'email'
};

// Create local strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false); } // User is not found

    // Compare Passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
// Options used to specifically tell where to find the token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload is the decoded jwt token - assigned a sub (subject) and iat (issued at time)
  // done is the callback function used to successfully authenticate the user (see below)

  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user); // Let passport know who the user is
    } else {
      done(null, false); // Didn't find a user - user is not authenticated
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin); // Passing into the strategy we defined above--^
passport.use(localLogin);
