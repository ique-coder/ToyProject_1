const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;


const chatSchema = new Schema({
	user: {
		type: ObjectId,
		require: true,
		ref: 'Account',
	},
	type: {
		type: String,
		require: true,
		default: 'public'
	},
	toUser: {
		type: ObjectId,
		ref: 'Account',
	},
	message: {
		type: String,
		require: true,
	},
	createAt: {
		type: Date,
		require: true,
		default: Date.now,
	}
});

module.exports = mongoose.model('Chat', chatSchema);