const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
	},
});

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			trim: true,
			required: [true, 'firstname is required'],
		},
		lastName: {
			type: String,
			trim: true,
			required: [true, 'lastname is required'],
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'email is required'],
			validate: {
				validator: function (v) {
					return /[a-z][0-9]*@[a-z]+.com/.test(v);
				},
				message: (props) => `${props.value} is not a valid email`,
			},
			immutable: true,
		},
		userName: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'userName is required'],
			immutable: true,
		},
		password: {
			type: String,
			trim: true,
			select: false,
			required: [true, 'password field is required'],
			validate: {
				validator: function (v) {
					return v.length > 6 && /\d+/.test(v);
				},
				message: (props) =>
					`password must be 6 characters long and must contain a number`,
			},
		},
		bio: {
			type: String,
			trim: true,
		},
		followersList: [childSchema],
		followingList: [childSchema],
	},
	{ timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
