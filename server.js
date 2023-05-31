/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Main server file for the application
**********************************************************/

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const connectDB = require('./database.js');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const User = require('./models/user.js');
const microserviceRoutes = require('./ms');

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', microserviceRoutes);
app.use(express.json());
app.set("view engine", "ejs");
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.session());

// Passport initialization
const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => User.findOne({ email: email }),
    id => User.findById(id)
);

// Connect to database
connectDB();

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/', userRoutes);
app.use('/', quizRoutes);
app.use('/', dashboardRoutes);
app.use(calculatorRoutes);

// Start the server
const port = 8080;
const host = "0.0.0.0";
var server = app.listen(port, host, () => {
    console.log('Server is listening on port', server.address().port);
});
