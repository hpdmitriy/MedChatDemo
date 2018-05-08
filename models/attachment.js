const mongoose = require('mongoose');
const path = require('path');

const attachmentSchema = new mongoose.Schema({
  oldName: {
    type: String,
    required: "Название отсутствует.",
  },
  newName: {
    type: String,
    required: "Название отсутствует.",
  },
  url: {
    type: String,
    required: "Url отсутствует.",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

attachmentSchema.methods.getPublicFields = function () {
    return {
      oldName: this.oldName,
      newName: this.newName,
      url: path.normalize(this.url),
      id: this._id,
      post: this.post,
    }
};

module.exports = mongoose.model('Attachment', attachmentSchema);
