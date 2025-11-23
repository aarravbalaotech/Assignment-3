var express = require('express');
var router = express.Router();
const passport = require('passport');
let DB = require('../config/db');
let userModel = require('../model/user');
let User = userModel.User;

function requireAuth(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    displayName: req.user ? req.user.displayName : ""
  });
});

/* GET dashboard page (authenticated users only) */
router.get('/dashboard', requireAuth, function(req, res, next) {
  res.render('dashboard', { 
    title: 'Dashboard',
    displayName: req.user.displayName,
    budgetCount: 0,
    totalExpenses: 0,
    goalCount: 0,
    progressPercentage: 0
  });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    displayName: req.user ? req.user.displayName : ""
  });
});

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('index', { 
    title: 'About us',
    displayName: req.user ? req.user.displayName : ""
  });
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('index', { 
    title: 'Products',
    displayName: req.user ? req.user.displayName : ""
  });
});

/* GET Services page. */
router.get('/services', function(req, res, next) {
  res.render('index', { 
    title: 'Services',
    displayName: req.user ? req.user.displayName : ""
  });
});

/* GET home page. */
router.get('/contact', function(req, res, next) {
  res.render('index', { 
    title: 'Contact us',
    displayName: req.user ? req.user.displayName : ""
  });
});

// Get method for login
router.get('/login', function(req,res,next){
  if(!req.user) {
    res.render('login', {
      title: 'Login',
      message: req.flash('loginMessage')
    });
  } else {
    return res.redirect("/dashboard");
  }
});

// Post method for login
router.post('/login', function(req,res,next){
  passport.authenticate('local', (err, user, info) => {
    if(err) {
      return next(err);
    }
    if(!user) {
      req.flash('loginMessage', 'Invalid credentials');
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      if(err) {
        return next(err);
      }
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

// Get method for register
router.get('/register', function(req, res, next){
  if(!req.user) {
    res.render('register', {
      title: 'Register',
      message: req.flash('registerMessage')
    });
  } else {
    return res.redirect("/dashboard");
  }
});

// Post method for register very annoyiong
router.post('/register', function(req, res, next){
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });
  
  User.register(newUser, req.body.password, (err) => {
    if(err) {
      console.log("Error: Inserting new user");
      if(err.name == "UserExistsError") {
        req.flash('registerMessage', 'Username already exists');
      } else {
        req.flash('registerMessage', 'Registration error: ' + err.message);
      }
      return res.render('register', {
        title: 'Register',
        message: req.flash('registerMessage')
      });
    } else {
      return passport.authenticate('local')(req, res, () => {
        res.redirect("/dashboard");
      });
    }
  });
});

// Logout
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if(err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;