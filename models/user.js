var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  google_id: { type: String, required: true, unique: true },
  admin: Boolean,
}, { timestamps: { createdAt: 'created_at',
                   updatedAt: 'updated_at'
                  }
    }
);

var User = mongoose.model('User', userSchema);

module.exports = User;
