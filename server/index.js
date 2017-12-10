// Code Stuff Here...
const express = require('express'); // ES5 notation vs. using import
const http = require('http'); // http --> native node library
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
// Note - using nodemon as a way to auto-update any saved changes
// so you don't have to restart the server over and over again
// Wired by adding - "dev": "nodemon index.js" inside scripts of package.json
// Execute using "npm run dev"

// mongoose = ORM to connect to mongoDB
// Create data model - User
// Email and Password attributes

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');


// App Setup
app.use(morgan('combined')); // middleware in express -- logging incoming requests
app.use(bodyParser.json( { type: '*/*' }));  // -- parse incoming requests into json no matter what type the request is...
router(app);
// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app); // Create HTTP Server forward onto express application.
server.listen(port);
console.log('Server listening on: ', port);
