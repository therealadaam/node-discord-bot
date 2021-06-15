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
		// const getUserDetails = (id) => {
		// 	db.getUserDetails(id).then((res) => {
		// 		const replyWith = res.rows;
		// 		console.log(replyWith);
		// 		message.reply(replyWith);
		// 	});
		// };

		db.checkUserExists(userId).then((res) => {
			if (res.rowCount) {
				db.getUser(userId).then((result) => {
					// forEach res add to messageToSend var
					// there should only ever be 1 row...hardcode?
					// this might create a future bug, but our key is userId...
					let messageToSend = '';
					result.rows.forEach((element) => {
						const loss_count = parseInt(element.loss_count) + 1;
						console.dir(loss_count);
						messageToSend += `You've lost the game ${loss_count} times
Your last loss was at ${element.last_loss}
Your first loss was at ${element.first_loss}`;
					});
					console.dir(messageToSend);

					db.updateUser(userId);
					message.channel.send(messageToSend);
				});
			} else {
				db.addUser(userId);
				const messageToSend =
					"Oh no! You've lost the game. This is the first time. I have added you.";
				message.reply(messageToSend);
			}
		});
	},
};
