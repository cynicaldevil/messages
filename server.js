var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

var Cancel = require('./models/cancel');

// express setup
var app = express();
app.set('view engine', 'ejs');
app.use('/styles', express.static('styles'));
app.use('/js', express.static('js'));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

app.get('/cancel', function (req, res) {
  res.render('cancel');
});

app.post('/cancel', function (req, res) {
  var result_str;
  var success = true;
  for(var key in req.body){
     if(req.body[key] === '') {
      success = false;
     }
  }
  if(success) {
    var newCancel = new Cancel({
      date: req.body.date,
      subject: req.body.subject,
      type: req.body.type,
      reason: req.body.reason,
    });

    newCancel.save((err, new_cancel) => {
      if(err) {
        throw err;
      }
      console.log('New Class Cancelled!', new_cancel);
    });
    result_str = "Submitted Successfully!";
  } else {
    result_str = "Please fill all the fields!";
  }
  res.send(result_str);
});

app.get('/pending', (req, res) => {
    Cancel.find({}, (err, cancels) => {
        let data_ = cancels.map((cancel, index) => {
            return {
                date: cancel.date,
                subject: cancel.subject,
                type: cancel.type,
                reason: cancel.reason
            };
        })
        res.render('pending', { data: data_ });
    });
});

app.get('/approved', (req, res) => {
  res.render('approved');
});

app.listen(8080, function () {
  console.log('Messages listening on port 8080!');
});
