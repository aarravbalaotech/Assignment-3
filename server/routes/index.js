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
router.get('/dashboard', requireAuth, async function(req, res, next) {
  try {
    const Budget = require('../model/budget');
    const Expense = require('../model/expense');
    const Goal = require('../model/goal');

    // fetch user's data
    const [budgets, expenses, goals] = await Promise.all([
      Budget.find({ user: req.user._id }).lean(),
      Expense.find({ user: req.user._id }).lean(),
      Goal.find({ user: req.user._id }).lean()
    ]);

    const budgetCount = budgets ? budgets.length : 0;
    const totalBudgetAmount = budgets && budgets.length ? budgets.reduce((s, b) => s + (parseFloat(b.amount) || 0), 0) : 0;

    const totalExpenses = expenses && expenses.length ? expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0) : 0;

    const goalCount = goals ? goals.length : 0;
    // progress: compute overall saved/target percent (sum currentAmount / sum targetAmount)
    const totalTarget = goals && goals.length ? goals.reduce((s, g) => s + (parseFloat(g.targetAmount) || 0), 0) : 0;
    const totalSaved = goals && goals.length ? goals.reduce((s, g) => s + (parseFloat(g.currentAmount) || 0), 0) : 0;
    const progressPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

    res.render('dashboard', {
      title: 'Dashboard',
      displayName: req.user.displayName,
      budgetCount: budgetCount,
      totalExpenses: totalExpenses,
      goalCount: goalCount,
      progressPercentage: progressPercentage,
      totalBudgetAmount: totalBudgetAmount,
      budgets: budgets,
      expenses: expenses,
      goals: goals
    });
  } catch (err) {
    console.error('Error rendering dashboard:', err && err.stack ? err.stack : err);
    next(err);
  }
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