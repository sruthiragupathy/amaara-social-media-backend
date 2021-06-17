const express = require('express');
const { isAuthorized } = require('../controllers/middleware');
const {
	getNotificationsOfAUser,
} = require('../controllers/notification.controller');
const router = express.Router();

router.get('/notifications', isAuthorized, getNotificationsOfAUser);

module.exports = router;
