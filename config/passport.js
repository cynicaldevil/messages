var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var fs = require('fs');

const oauth_data = JSON.parse(fs.readFileSync('./oauth_client_data.json')).web;

module.exports = (passport) => {

    passport.serializeUser(function(user, done) {
        console.log('USER SER: ',user.id);
        done(null, user.google_id);
    });
    passport.deserializeUser(function(id, done) {
        User.findOne({ google_id: id }, function(err, user) {
            console.log('USER DESER', user);
            done(null, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: oauth_data.client_id,
        clientSecret: oauth_data.client_secret,
        callbackURL: "http://localhost:8080/oauth2callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne({ google_id: profile.id }, function (err, user) {
            if(err) {
              console.log(err);
              return done(err, null);
            } else if(user === null) {
                var new_user=new User({
                    google_id: profile.id,
                    admin_level: 0
                });
                new_user.save((err, new_user) => {
                    if (err) {
                        throw err;
                    }
                    console.log('User created!,', new_user);
                    return done(null, new_user);
                });
           } else if(user != null) {
                return done(null, user);
           }
        });
      }
    ));
};
