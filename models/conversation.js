const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const conversationSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	assistant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	posts: {
		type: Number,
		default:0
	},
  isNewConversation: {
		type: Boolean,
		default:true
	},
  isActiveConversation: {
      type: Boolean,
      default:false
    },
  isEmptyConversation: {
      type: Boolean,
      default:true
    }
	/*
			posts: [{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Post',
			}],
	*/
}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	},
	toObject: {
		virtuals: true
	}
});
conversationSchema.methods.getPublicFields = function () {
	return {
		name: this.name,
		id: this._id,
		posts: this.posts,
    assistant: this.assistant,
    client: this.client,
    isNewConversation: this.isNewConversation,
    isActiveConversation: this.isActiveConversation,
    isEmptyConversation: this.isEmptyConversation,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
	}
};

conversationSchema.plugin(beautifyUnique);


module.exports = mongoose.model('Conversation', conversationSchema);
