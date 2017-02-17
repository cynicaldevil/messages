var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cancelSchema = new Schema({
  date: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true },
  reason: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at',
                   updatedAt: 'updated_at'
                  }
    }
);

var Cancel = mongoose.model('Cancel', cancelSchema);

module.exports = Cancel;
