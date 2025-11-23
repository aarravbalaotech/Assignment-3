var express = require('express');
var router = express.Router();
const passport = require('passport');
let DB = require('../config/db');
let userModel = require('../model/user');
let User = userModel.User;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home',
    displayName: req.user?req.user.displayName:""
   });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home',displayName: req.user?req.user.displayName:"" });
});

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About us',displayName: req.user?req.user.displayName:"" });
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  res.render('index', { title: 'Products',displayName: req.user?req.user.displayName:"" });
});

/* GET Services page. */
router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Services',displayName: req.user?req.user.displayName:"" });
});

/* GET home page. */
router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact us',displayName: req.user?req.user.displayName:"" });
});

// Get method for login
router.get('/login', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/login',
      {
      title:'Login',
      message: req.flash('loginMessage')
      }

    )
  }
  else
  {
    return res.redirect("/")
  }
});

// Post method for login
router.post('/login', function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err);
    }
    if(!user)
    {
      req.flash('loginMessage','AuthenticationError');
      return res.redirect('/login');
    }
    req.login(user,(err)=>{
    if(err)
    {
      return next(err);
    }
    return res.redirect("/books")
    })
  })(req,res,next)
});

// Get method for register
router.get('/register', function(req,res,next){
  if(!req.user)
  {
    res.render('auth/register',
      {
      title:'Register',
      message: req.flash('registerMessage')
      }

    )
  }
  else
  {
    return res.redirect("/")
  }
});

// Post method for register
router.post('/register', function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    //password: req.body.password,
    email:req.body.email,
    displayName: req.body.displayName
  })
  User.register(newUser, req.body.password, (err)=>{
    if(err)
    {
      console.log("Error:Inserting the new user");
      if(err.name=="UserExistingError")
      {
        req.flash('registerMessage','Registration Error:User already Exist');
      }
      return res.render('auth/register',
        {
          title:'Register',
          message:req.flash('registerMessage')
        }
      )
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect("/books");
      })
    }
  })
});
router.get('/logout',function(req,res,next){
req.logout(function(err)
{
  if(err)
  {
    return next(err)
  }
})
res.redirect("/");
})
module.exports = router;