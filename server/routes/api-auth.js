let express = require('express');
let router = express.Router();
let userModel = require('../model/user');
let User = userModel.User;
let passport = require('passport');

// API POST /api/auth/register
router.post('/register', function(req,res,next){
  let newUser = new User({
    username: req.body.username || req.body.email,
    email: req.body.email,
    displayName: req.body.displayName || req.body.name
  })
  User.register(newUser, req.body.password, (err)=>{
    if(err)
    {
      console.log("Error: Inserting the new user");
      if(err.name=="UserExistingError")
      {
        return res.status(400).json({message:'User already exists'});
      }
      return res.status(400).json({message: err.message});
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.json({
          message: 'Registered successfully',
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            displayName: newUser.displayName
          }
        });
      })
    }
  })
});

// API POST /api/auth/login
router.post('/login', function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return res.status(500).json({message:'Server error'});
    }
    if(!user)
    {
      return res.status(401).json({message: info.message || 'Login failed'});
    }
    req.login(user,(err)=>{
    if(err)
    {
      return res.status(500).json({message:'Login failed'});
    }
    return res.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName
      }
    });
    })
  })(req,res,next)
});

// API GET /api/auth/logout
router.get('/logout',function(req,res,next){
  req.logout(function(err)
  {
    if(err)
    {
      return res.status(500).json({message:'Logout failed'});
    }
    res.json({message: 'Logged out successfully'});
  })
});

// API GET /api/auth/user - Get current logged in user
router.get('/user', function(req,res,next){
  if(req.isAuthenticated())
  {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        displayName: req.user.displayName
      }
    });
  }
  else
  {
    res.status(401).json({message: 'Not authenticated'});
  }
});

module.exports = router;
