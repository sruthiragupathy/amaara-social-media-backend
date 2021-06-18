const Notification = require('../models/notification.model');

const getNotificationsOfAUser = async (req, res) => {
	const { userId } = req;
	try {
		const notifications = await Notification.find({
			owner: userId,
		}).populate({
			path: 'owner',
		});
		res.json({ notifications });
	} catch (error) {
		console.error(error);
		res.status(403).json({ error: error.message });
	}
};

const postNotification = async (
	owner,
	performer,
	activityType,
	post = null,
) => {
	try {
		const newNotification = new Notification({
			owner,
			performer,
			activityType,
			post,
		});
		await newNotification.save();
	} catch (error) {
		console.error({ error });
		// res.status(403).json({ error: error.message });
	}
};

module.exports = { getNotificationsOfAUser, postNotification };
