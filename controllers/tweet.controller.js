const Tweet = require('../models/tweet.model');
const { extend } = require('lodash');

const getAllTweets = async (req, res) => {
	try {
		const allTweets = await Tweet.find()
			.sort({ createdAt: -1 })
			.populate({ path: 'userId' });
		res.json({ tweets: allTweets });
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const postTweet = async (req, res) => {
	const { tweet } = req.body;
	try {
		const newTweet = new Tweet({
			tweet: tweet,
			userId: req.userId,
		});
		await newTweet.save();
		await newTweet.populate('userId').execPopulate();
		res.json({ tweet: newTweet });
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const findTweetById = async (req, res) => {
	const { tweet } = req;
	try {
		await tweet.populate('userId').execPopulate();
		res.json({ tweet });
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const updateTweetReactions = async (req, res) => {
	let { tweet } = req;
	const { userId } = req;
	const { reactionName, reactionCount } = req.body;
	try {
		const hasCurrentUserAlreadyReacted =
			tweet[reactionName].reactedUsers.length === 0
				? false
				: tweet[reactionName].reactedUsers.id(userId);
		if (hasCurrentUserAlreadyReacted) {
			tweet[reactionName].reactionCount -= reactionCount;
			await tweet[reactionName].reactedUsers.id(userId).remove();
		} else {
			tweet[reactionName].reactionCount += reactionCount;
			await tweet[reactionName].reactedUsers.push({ _id: userId });
		}
		await tweet.save();
		await tweet.populate('userId').execPopulate();
		res.json({ tweet });
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const updateTweet = async (req, res) => {
	const { tweet } = req;
	const { editedTweet } = req.body;
	try {
		tweet.tweet = editedTweet;
		await tweet.save();
		console.log({ tweet });
		await tweet.populate('userId').execPopulate();
		res.json({ tweet });
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};

const deleteTweet = async (req, res) => {
	const { tweet } = req;
	await tweet.populate('userId').execPopulate();
	try {
		if (req.userId == tweet.userId._id) {
			await tweet.remove();
			const tweets = await Tweet.find()
				.sort({ createdAt: -1 })
				.populate({ path: 'userId' });
			res.json({ tweets });
		} else {
			throw Error('You dont have permission to delete this tweet');
		}
	} catch (error) {
		console.error({ error });
		res.status(401).json({ response: error.message });
	}
};
module.exports = {
	getAllTweets,
	postTweet,
	findTweetById,
	updateTweetReactions,
	updateTweet,
	deleteTweet,
};
