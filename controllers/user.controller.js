const User = require('../models/user.model');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { postNotification } = require('./notification.controller');

const signupUser = async (req, res) => {
	try {
		//check if user exists
		const user = await User.findOne({ email: req.body.user.email });
		if (user) {
			throw new Error('User Already exists');
		}
		//check if username exists
		const userName = await User.findOne({ userName: req.body.user.userName });
		if (userName) {
			throw new Error('UserName Already exists, try a different username');
		}
		//encrypt password and save new user
		const newUser = new User({
			...req.body.user,
			followersList: [],
			followingList: [],
		});
		const salt = await bcrypt.genSalt(10);
		newUser.password = await bcrypt.hash(newUser.password, salt);
		await newUser.save();
		//generate token
		const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
			expiresIn: '24h',
		});
		newUser.password = undefined;
		res.json({
			token,
			user: newUser,
		});
	} catch (error) {
		console.error(error);
		res.status(401).json({ error: error.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			throw new Error('User does not exist, Signup to enter');
		}
		//decrypt password and validate
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error('Email and password does not match');
		}
		//generate token
		const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: '24h',
		});

		user.password = undefined;
		await user.populate('followersList.user').execPopulate();
		await user.populate('followingList.user').execPopulate();
		res.json({
			token,
			user,
		});
	} catch (error) {
		console.log({ error });
		return res.status(401).json({ error: error.message });
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		return res.json({
			users,
		});
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const followUser = async (
	currentUser,
	followingUser,
	userId,
	followingUserId,
) => {
	try {
		//follow functionality
		//update the following list of current user with following user
		currentUser.followingList.push({
			_id: followingUserId,
		});
		await currentUser.save();
		//update the followers list of following user with current user
		followingUser.followersList.push({
			_id: userId,
		});
		await followingUser.save();
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const unFollowUser = async (
	currentUser,
	followingUser,
	userId,
	followingUserId,
) => {
	try {
		//unfollow functionality
		//remove the following user from the current user's following list
		currentUser.followingList.id(followingUserId).remove();
		await currentUser.save();
		//remove the follower from the following user's followersList
		followingUser.followersList.id(userId).remove();
		await followingUser.save();
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const findUserByUserName = async (req, res) => {
	const { userName } = req.params;
	try {
		const user = await User.findOne({ userName });
		await user.populate('followersList.user').execPopulate();
		await user.populate('followingList.user').execPopulate();
		return res.json({
			user,
		});
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const updateUser = async (req, res) => {
	const { userId } = req;
	const { bio } = req.body;
	try {
		const currentUser = await User.findById(userId);
		currentUser.bio = bio;
		await currentUser.save();
		res.json({ user: currentUser });
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const updateFollowersandFollowingListsOnFollow = async (req, res) => {
	const { userId } = req;
	const { followingUserId } = req.body;
	try {
		//find currentUser and following User Object
		const currentUser = await User.findById(userId);
		const followingUser = await User.findById(followingUserId);

		const isCurrentUserAlreadyFollowingTheFollowedUser =
			currentUser.followingList.id(followingUserId);
		if (isCurrentUserAlreadyFollowingTheFollowedUser) {
			//unfollow functionality
			//remove the following user from the current user's following list
			await currentUser.followingList.id(followingUserId).remove();
			await currentUser.save();
			//remove the follower from the following user's followersList
			await followingUser.followersList.id(userId).remove();
			await followingUser.save();
		} else {
			//follow functionality
			//update the following list of current user with following user

			await currentUser.followingList.push({
				_id: followingUserId,
				user: followingUserId,
			});
			await currentUser.save();
			//update the followers list of following user with current user
			await followingUser.followersList.push({
				_id: userId,
				user: userId,
			});
			await postNotification(followingUserId, userId, 'follow');
			await followingUser.save();
		}
		// get all the updated users and return
		const users = await User.find();
		return res.json({
			users,
		});
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const deleteAllUsers = async (req, res) => {
	try {
		const users = await User.deleteMany();
		return res.json({
			users,
		});
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

module.exports = {
	signupUser,
	loginUser,
	getAllUsers,
	findUserByUserName,
	deleteAllUsers,
	updateUser,
	updateFollowersandFollowingListsOnFollow,
};
