var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var fs = require('fs');

// express setup
var app = express();
app.set('view engine', 'ejs');
app.use('/styles', express.static('styles'));

// passport setup
var oauth_data = JSON.parse(fs.readFileSync('./oauth_client_data.json')).web;
passport.use(new GoogleStrategy({
    clientID: oauth_data.client_id,
    clientSecret: oauth_data.client_secret,
    callbackURL: "https://localhost:8080/oauth2callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        }
);

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(8080, function () {
  console.log('Messages listening on port 8080!');
});
