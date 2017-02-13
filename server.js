var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');

// express setup
var app = express();
app.set('view engine', 'ejs');
app.use('/styles', express.static('styles'));
app.use(passport.initialize());
app.use(passport.session());

// mongodb setup
const mongodb_url='mongodb://cynicaldevil:nikhils96@ds143539.mlab.com:43539/messages';
mongoose.connect(mongodb_url).then((err)=> {
    if(err) {
      console.log(err);
    } else {
      console.log('success!');
    }
  });

// pass passport for config
require('./config/passport.js')(passport);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/oauth2callback',
    passport.authenticate('google', { failureRedirect: '/' }),
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
