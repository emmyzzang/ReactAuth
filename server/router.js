const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');


// Creating the interceptor
const requireAuth = passport.authenticate('jwt', { session: false });

const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {

  // Expecting a .get request to come in
  // req - request incoming http request
  // res - response to send back to the request
  // next - error handling
  // app.get('/', function(req, res, next) {
  //     res.send(['watterbottle', 'phone', 'paper']);
  // });
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there'});
  });

  // Before the user even hits 'Authentication.signin' - 'requireSignin' is called
  // as a middleware to require the user to sign in with email//password
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);



}
