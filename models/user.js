var mongoose = require('mongoose');
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
