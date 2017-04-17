var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var Cancel = require('./models/cancel');

// express setup
var app = express();
app.set('view engine', 'ejs');
app.use('/styles', express.static('styles'));
app.use('/js', express.static('js'));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(expressSession({
            secret: 'keyboard cat',
            name: 'nikhil',
            resave: true,
            saveUninitialized: true,
        }));

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
app.use(passport.initialize());
app.use(passport.session());

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
};

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

// embarassing global var
let login_status = 'in';

app.get('/oauth2callback',
    passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
          login_status = 'out';
            res.redirect('/');
        }
);

app.get('/', (req, res) => {
    Cancel.find({ status: 'approved' }).exec((err, cancels) => {
        let data_ = cancels.map((cancel, index) => {
            return {
                date: cancel.date,
                subject: cancel.subject,
                type: cancel.type,
                reason: cancel.reason,
                status: cancel.status,
            };
        })
        let show_cancel_class = false;
        if(req.user && req.user.admin_level === 1) {
          show_cancel_class = true;
        }
        res.render('index', { data: data_, login_status, show_cancel_class });
    });
});

app.get('/cancel', ensureAuthenticated, function (req, res) {
    if(req.user.admin_level > 0) {
        res.render('cancel', { login_status });
    } else {
        res.redirect('/');
    }
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
      status: 'pending',
    });

    newCancel.save((err, new_cancel) => {
      if(err) {
        throw err;
      }
      console.log('New (potential) Class Cancelled!', new_cancel);
    });
    result_str = "Submitted Successfully!";
  } else {
    result_str = "Please fill all the fields!";
  }
  res.send(result_str);
});

app.get('/pending', ensureAuthenticated, (req, res) => {
    if(req.user && req.user.admin_level > 0) {
        Cancel.find({status: 'pending'}, (err, cancels) => {
            let data = cancels.map((cancel, index) => {
                return {
                    date: cancel.date,
                    subject: cancel.subject,
                    type: cancel.type,
                    reason: cancel.reason
                };
            })
            let show_cancel_class = false;
            let can_approve = false;
            if(req.user.admin_level === 1) {
              show_cancel_class = true;
            } else if(req.user.admin_level === 2) {
              can_approve = true;
            }
            res.render('pending', { data,
                                    login_status,
                                    show_cancel_class,
                                    can_approve });
        });
    } else {
        res.redirect('/');
    }
});

app.post('pending', ensureAuthenticated, (req, res) => {
    // console.log(req.body.);
});

app.get('/approved', ensureAuthenticated, (req, res) => {
    if(req.user && req.user.admin_level > 0) {
        Cancel.find({$or: [{ status: 'approved' }, { status: 'not approved'}]}).exec((err, cancels) => {
            let data_ = cancels.map((cancel, index) => {
                return {
                    date: cancel.date,
                    subject: cancel.subject,
                    type: cancel.type,
                    reason: cancel.reason,
                    status: cancel.status,
                };
            })
            let show_cancel_class = false;
            if(req.user.admin_level === 1) {
              show_cancel_class = true;
            }
            res.render('approved', { data: data_, user: req.user, login_status, show_cancel_class });
        });
    } else {
        res.redirect('/');
    }
});

app.get('/logout', function(req, res){
  req.logout();
  login_status = 'in';
  res.redirect('/');
});

app.listen(8080, function () {
  console.log('Messages listening on port 8080!');
});
