var jwt = require('jsonwebtoken');
const Tweet = require('../models/tweet.model');
const User = require('../models/user.model');
const isAuthorized = (req, res, next) => {
	const token = req.headers.authorization;
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		res.status(401).json({ message: error.message });
	}
};

const getTweetById = async (req, res, next) => {
	const { tweetId } = req.params;
	try {
		const tweet = await Tweet.findById(tweetId);
		req.tweet = tweet;
		next();
	} catch (error) {
		console.error({ error });
	}
};

const getUserIdByUserName = async (req, res, next) => {
	const { userName } = req.params;
	try {
		const user = await User.findOne({ userName });
		req.userId = user._id;
		next();
	} catch (error) {
		console.error({ error });
	}
};

module.exports = { isAuthorized, getTweetById, getUserIdByUserName };
