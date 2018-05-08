const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
//const Message = require('./messages_new');
/*

 mongoose.Promise = Promise;

 mongoose.connect('mongodb://localhost/test2');
 */
mongoose.set('debug', true);
const userSchema = new mongoose.Schema({
  realId: {
    type: String,
    required: "Id отсутствует.",
    unique: true
  },
  name: {
    type: String,
    required: "Имя пользователя отсутствует.",
  },
  role: {
    type: String,
    enum: {
      values: ['assistant', 'client', 'moderator', 'admin', 'patient', 'guest', 'developer'],
      message: 'Unknown value for role!'
    },
    default: 'patient',
    required: 'Role is required!'
  },
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assistants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: {
      values: ['Online', 'Offline'],
      message: 'Unknown value for status!'
    },
    default: 'Offline',
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

userSchema.methods.isAssistant = function () {
  return this.role === 'Assistant';
};
userSchema.methods.isClient = function () {
  return this.role === 'Client';
};

/*userSchema.virtual('getClients', {
 ref: 'User',
 localField: '_id',
 foreignField: 'clients'
 });
 userSchema.virtual('getAssistants', {
 ref: 'User',
 localField: '_id',
 foreignField: 'assistants'
 });*/

userSchema.methods.getPublicFields = function () {
  return {
      name: this.name,
      role: this.role,
      id: this._id,
      clients: this.clients,
      assistants: this.assistants,
      status: this.status
    }
};

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
  justOne: false
});

userSchema.plugin(beautifyUnique);
module.exports = mongoose.model('User', userSchema);
