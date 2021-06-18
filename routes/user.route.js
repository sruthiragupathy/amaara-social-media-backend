const express = require('express');
const { isAuthorized } = require('../controllers/middleware');
const {
	signupUser,
	loginUser,
	getAllUsers,
	deleteAllUsers,
	findUserByUserName,
	updateFollowersandFollowingListsOnFollow,
	updateUser,
	// findCurrentUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

router.get('/users', isAuthorized, getAllUsers);
router.get('/user/:userName', isAuthorized, findUserByUserName);
router.post('/user', isAuthorized, updateUser);
router.post(
	'/user/follow',
	isAuthorized,
	updateFollowersandFollowingListsOnFollow,
);

router.delete('/users', deleteAllUsers);

module.exports = router;
