const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  message: {},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: 'Author is required!'
  },
  messageId: String,
  transportResponse: {
    messageId: String,
    envelope: {},
    accepted: {},
    rejected: {},
    pending: {},
    response: String
  }

}, {
  timestamps: true
});


letterSchema.index({ 'message.to.address': 1 });
letterSchema.index({ 'messageId': 1 });

module.exports = mongoose.model('Letter', letterSchema);
