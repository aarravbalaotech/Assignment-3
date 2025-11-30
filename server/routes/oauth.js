let express = require('express');
let router = express.Router();
let passport = require('passport');

function strategyAvailable(name) {
  try {
    return !!passport._strategy(name);
  } catch (e) {
    return false;
  }
}

// Start GitHub OAuth (guarded)
router.get('/github', (req, res, next) => {
  if (!strategyAvailable('github')) {
    req.flash('loginMessage', 'GitHub OAuth is not configured on this server.');
    return res.redirect('/login');
  }
  return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

// GitHub callback (guarded)
router.get('/github/callback', (req, res, next) => {
  if (!strategyAvailable('github')) {
    req.flash('loginMessage', 'GitHub OAuth is not configured on this server.');
    return res.redirect('/login');
  }
  return passport.authenticate('github', { failureRedirect: '/login' })(req, res, () => {
    res.redirect('/dashboard');
  });
});

// Start Google OAuth (guarded)
router.get('/google', (req, res, next) => {
  if (!strategyAvailable('google')) {
    req.flash('loginMessage', 'Google OAuth is not configured on this server.');
    return res.redirect('/login');
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google callback (guarded)
router.get('/google/callback', (req, res, next) => {
  if (!strategyAvailable('google')) {
    req.flash('loginMessage', 'Google OAuth is not configured on this server.');
    return res.redirect('/login');
  }
  return passport.authenticate('google', { failureRedirect: '/login' })(req, res, () => {
    res.redirect('/dashboard');
  });
});

// POST logout (for SPA/JS safety)
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
