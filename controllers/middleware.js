var jwt = require('jsonwebtoken');
const Tweet = require('../models/tweet.model');

const isAuthorized = (req, res, next) => {
	const token = req.headers.authorization;
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		res
			.status(401)
			.json({ message: 'Unauthorised access, please add the token' });
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

module.exports = { isAuthorized, getTweetById };
