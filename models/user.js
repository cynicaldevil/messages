var mongoose = require('mongoose');

const mongodb_url='mongodb://<dbuser>:<dbpassword>@ds143539.mlab.com:43539/messages';
mongoose.connect(mongodb_url);

var Schema = mongoose.Schema;


var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  created_at: Date,
  updated_at: Date
});

var User = mongoose.model('User', userSchema);

module.exports = User;
