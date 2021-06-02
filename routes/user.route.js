const express = require('express');
const isAuthorized = require('../controllers/middleware');
const {
	signupUser,
	loginUser,
	getAllUsers,
	deleteAllUsers,
	updateFollowersandFollowingListsOnFollow,
	updateUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

router.get('/users', isAuthorized, getAllUsers);
router.post('/user', isAuthorized, updateUser);
router.post(
	'/user/follow',
	isAuthorized,
	updateFollowersandFollowingListsOnFollow,
);

module.exports = router;
