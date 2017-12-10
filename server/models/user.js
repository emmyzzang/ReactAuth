const mongoose = require('mongoose');

// Tell use particular fields that a model will have...
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');

// Define our model
// Javascript String Type
// Mindful of uniqueness and lowercase enforcing
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function 'pre'
// this will run before the user is saved
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this; // user.email, user.password

  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
        if(err) { return next(err); }

        // overwrite plain text password with encrypted password
        user.password = hash;

        // Go ahead and save the model... continue the next step
        next();
    });
  });
});

// Compares stored password with the candidate password (for User login)
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

// Create the model class
// Creates user collection and passes schema.
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass; // ES5 style....not ES6
