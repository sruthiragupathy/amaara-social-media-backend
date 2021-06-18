const express = require('express');
const {
	isAuthorized,
	getTweetById,
	getUserIdByUserName,
} = require('../controllers/middleware');

const {
	postTweet,
	findTweetById,
	updateTweetReactions,
	getAllTweets,
	updateTweet,
	deleteTweet,
	getTweetsByUserId,
} = require('../controllers/tweet.controller');

const router = express.Router();

router.param('tweetId', getTweetById);
router.param('userName', getUserIdByUserName);

router.post('/tweet', isAuthorized, postTweet);
router.get('/tweets', getAllTweets);
router.get('/tweet/:tweetId', findTweetById);
router.get('/profile/:userName', getTweetsByUserId);
router.post('/tweet/:tweetId', isAuthorized, updateTweet);
router.post('/tweet/reactions/:tweetId', isAuthorized, updateTweetReactions);
router.delete('/tweet/:tweetId', isAuthorized, deleteTweet);
module.exports = router;
