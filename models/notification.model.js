const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		performer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		activityType: {
			type: String,
			enum: ['react', 'follow'],
		},
		post: {
			type: Schema.Types.ObjectId,
			ref: 'Tweet',
			default: null,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Notification', notificationSchema);
