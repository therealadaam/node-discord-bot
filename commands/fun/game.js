const db = require('../../db');
module.exports = {
	name: 'game',
	description:
		'Counts how many times you have lost the game and lets your server know',
	cooldown: 5,
	guildOnly: true,
	execute(message) {
		// check if user is in the DB already
		const userId = message.author.id;
		const getUserDetails = (id) => {
			db.getUserDetails(id).then((res) => {
				const replyWith = res.rows;
				message.reply(replyWith);
			});
		};

		db.checkUserExists(userId).then((res) =>
			res.rowCount ? getUserDetails(userId) : db.addUser(userId)
		);
	},
};
