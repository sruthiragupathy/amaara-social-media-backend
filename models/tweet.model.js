const mongoose = require('mongoose');
const { Schema } = mongoose;

const tweetSchema = new Schema({
	tweet: {
		type: String,
		required: [true, 'Empty tweet cannot be stored'],
	},
	likes: {
		type: Number,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = tweetSchema;
