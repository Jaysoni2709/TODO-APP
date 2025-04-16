// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const token = require('./utils/token');

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:5000/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const { name, email } = profile._json;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        provider: 'google',
      });
    } else if (user.isBlocked) {
      return done(null, false, { message: 'User is blocked' });
    } else if (user.provider !== 'google') {
      user.provider = 'google';
      await user.save();
    }

    const tokens = token({ id: user._id, role: user.role });
    
    return done(null, user, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  }).catch(done);
});
