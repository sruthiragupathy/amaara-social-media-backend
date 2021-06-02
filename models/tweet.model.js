const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

const reactionSchema = new Schema({
	reactionCount: {
		type: Number,
		default: 0,
	},
	reactedUsers: [childSchema],
});

const tweetSchema = new Schema(
	{
		tweet: {
			type: String,
			required: [true, 'Empty tweet cannot be stored'],
		},
		thumbsUp: {
			type: reactionSchema,
			default: {
				reactionCount: 0,
				reactedUsers: [],
			},
		},
		hooray: {
			type: reactionSchema,
			default: {
				reactionCount: 0,
				reactedUsers: [],
			},
		},
		heart: {
			type: reactionSchema,
			default: {
				reactionCount: 0,
				reactedUsers: [],
			},
		},
		rocket: {
			type: reactionSchema,
			default: {
				reactionCount: 0,
				reactedUsers: [],
			},
		},
		eyes: {
			type: reactionSchema,
			default: {
				reactionCount: 0,
				reactedUsers: [],
			},
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('tweet', tweetSchema);
