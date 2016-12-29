var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.use('/styles', express.static('styles'));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});