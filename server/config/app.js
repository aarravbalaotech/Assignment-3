var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
// configuring Databases
let mongoose = require('mongoose');
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');
let cors = require('cors')
var app = express();
let userModel = require('../model/user');
let User = userModel.User;

// point mongoose to the DB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentfinancedb';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsAllowInvalidCertificates: true, // Disable SSL certificate validation for Atlas
  tlsAllowInvalidHostnames: true,     // Allow invalid hostnames
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
});
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind('console','Connection Error'));
mongoDB.once('open',()=>{
  console.log('Connected to the MongoDB');
});

// Set-up Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || "Somesecret",
  saveUninitialized:false,
  resave:false
}))

// expose DB connection status to views
app.use(function(req, res, next) {
  try {
    res.locals.dbConnected = mongoose.connection && mongoose.connection.readyState === 1;
  } catch (ex) {
    res.locals.dbConnected = false;
  }
  next();
});

// initialize flash
app.use(flash());
// user authentication
passport.use(User.createStrategy());
// serialize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// initialize the passport
app.use(passport.initialize());
app.use(passport.session());

// Import routes
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
let budgetsRouter = require('../routes/budget');
let expensesRouter = require('../routes/expense');
let goalsRouter = require('../routes/goal');

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Mount routes (all server-rendered EJS)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/budgets', budgetsRouter);
app.use('/expenses', expensesRouter);
app.use('/goals', goalsRouter);

// Redirect old /books routes to dashboard (feature removed)
app.get('/books', (req, res) => res.redirect('/dashboard'));
app.get('/books/*', (req, res) => res.redirect('/dashboard'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // log full error for debugging
  console.error('Express error handler:', err && err.stack ? err.stack : err);

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title:'Error'});
});

module.exports = app;
