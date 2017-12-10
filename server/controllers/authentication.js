const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  // first param - information we want to encode
  // second param - secret
  // jwt has a convention sub= "subject" of this token
  // jwt has a convention iat= "issued at time" of this token
  // More information - https://jwt.io
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  // console.log(req.body); // Tip: Check the request message using this!!! :)
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if(err) { return next(err); }

    // If a user with email does exist, return an Error
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
      // 422 = Unprocessable entity error
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if(err) { return next(err); }

      // Response to Request indicating the user was created
      // After user successfully creates an account - it is a valid session
      // so we will need to generate a token to allow access to the webpage
      res.json({ token: tokenForUser(user)});
    }); // Saves the record to the DB.
  });
}
