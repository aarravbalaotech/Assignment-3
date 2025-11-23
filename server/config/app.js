var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// configuring Databases
let mongoose = require('mongoose');
let DB = require('./db');
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
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind('console','Connection Error'));
mongoDB.once('open',()=>{
  console.log('Connected to the MongoDB');
});
// Set-up Express Session
app.use(session({
  secret:"Somesecret",
  saveUninitialized:false,
  resave:false
}))
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
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
let booksRouter = require('../routes/book');

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title:'Error'});
});

module.exports = app;
