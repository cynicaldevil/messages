var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var fs = require('fs');

// express setup
var app = express();
app.set('view engine', 'ejs');
app.use('/styles', express.static('styles'));

// passport setup
var oauth_data = JSON.parse(fs.readFileSync('./oauth_client_data.json')).web;
console.log(oauth_data);
passport.use(new GoogleStrategy({
    consumerKey: oauth_data.client_id,
    consumerSecret: oauth_data.client_secret,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
  }
));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(8080, function () {
  console.log('Messages listening on port 8080!');
});
