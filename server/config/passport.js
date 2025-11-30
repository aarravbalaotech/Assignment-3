// Passport configuration: local + GitHub + Google strategies
let GitHubStrategy;
let GoogleStrategy;
try {
  GitHubStrategy = require('passport-github2').Strategy;
} catch (e) {
  console.warn('passport-github2 not installed or failed to load. GitHub OAuth will be disabled.');
}
try {
  GoogleStrategy = require('passport-google-oauth20').Strategy;
} catch (e) {
  console.warn('passport-google-oauth20 not installed or failed to load. Google OAuth will be disabled.');
}

module.exports = function(passport, User) {
  const appPort = process.env.PORT || 5000;

  // Local strategy is handled by passport-local-mongoose on the User model
  if (typeof User.createStrategy === 'function') {
    passport.use(User.createStrategy());
    console.log('Passport: registered local strategy via passport-local-mongoose');
  }

  // Serialize/deserialize (passport-local-mongoose provides helpers)
  if (typeof User.serializeUser === 'function' && typeof User.deserializeUser === 'function') {
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
  } else {
    passport.serializeUser(function(user, done){ done(null, user.id); });
    passport.deserializeUser(async function(id, done){
      try { const u = await User.findById(id); done(null, u); } catch(err){ done(err); }
    });
  }

  // Helper used by both strategies to find or create a user
  async function findOrCreateOAuthUser(provider, providerId, profile, email, done) {
    try {
      const idField = provider + 'Id';
      // 1) find by provider id
      let user = await User.findOne({ [idField]: providerId });
      if (user) return done(null, user);

      // 2) try find by email and link
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          user[idField] = providerId;
          await user.save();
          return done(null, user);
        }
      }

      // 3) create new user
      // derive a username
      const base = (profile.username || profile.displayName || (email ? email.split('@')[0] : provider + providerId)).replace(/\s+/g,'').toLowerCase();
      let username = base;
      let counter = 0;
      while (await User.findOne({ username })) { counter++; username = base + counter; }

      const newUser = new User({
        username: username,
        email: email ? email.toLowerCase() : '',
        displayName: profile.displayName || profile.username || username,
      });
      newUser[idField] = providerId;
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }

  // GitHub strategy
  if (GitHubStrategy) {
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      const githubCallback = process.env.GITHUB_CALLBACK || `http://localhost:${appPort}/auth/github/callback`;
      passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: githubCallback,
        scope: ['user:email']
      }, function(accessToken, refreshToken, profile, done) {
        const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;
        findOrCreateOAuthUser('github', profile.id, profile, email, done);
      }));
      console.log('Passport: registered GitHub strategy (callback=' + githubCallback + ')');
    } else {
      console.warn('GitHub OAuth credentials not found in env; GitHub strategy not registered.');
    }
  }

  // Google strategy
  if (GoogleStrategy) {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      const googleCallback = process.env.GOOGLE_CALLBACK || `http://localhost:${appPort}/auth/google/callback`;
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallback
      }, function(accessToken, refreshToken, profile, done) {
        const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;
        findOrCreateOAuthUser('google', profile.id, profile, email, done);
      }));
      console.log('Passport: registered Google strategy (callback=' + googleCallback + ')');
    } else {
      console.warn('Google OAuth credentials not found in env; Google strategy not registered.');
    }
  }
};
