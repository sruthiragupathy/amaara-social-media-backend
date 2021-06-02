const User = require('../models/user.model');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signupUser = async (req, res) => {
	try {
		//check if user exists
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.json({ message: 'User Already exists' });
		}
		//check if username exists
		const userName = await User.findOne({ userName: req.body.userName });
		if (userName) {
			return res.json({
				message: 'UserName Already exists, try a different username',
			});
		}
		//encrypt password and save new user
		const newUser = new User({
			...req.body,
			followersList: [],
			followingList: [],
			bio: '',
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
		const user = await User.findOne({ email });

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

		user.password = 'undefined';
		res.json({
			token,
			user,
		});
	} catch (error) {
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
	}
};

const updateUser = async (req, res) => {
	const { userId } = req;

	try {
		//possible to edit only your account
		if (userId !== req.body._id) {
			throw new Error("You cannot edit someone else's account");
		}
		const updatedUser = await User.findByIdAndUpdate(userId, req.body);
		updatedUser.password = undefined;
		res.json({ user: updatedUser });
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
			unFollowUser(currentUser, followingUser, userId, followingUserId);
		} else {
			followUser(currentUser, followingUser, userId, followingUserId);
		}
		//get all the updated users and return
		const users = await User.find();
		return res.json({
			users,
		});
	} catch (error) {
		console.error({ error });
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
	}
};

module.exports = {
	signupUser,
	loginUser,
	getAllUsers,
	deleteAllUsers,
	updateUser,
	updateFollowersandFollowingListsOnFollow,
};