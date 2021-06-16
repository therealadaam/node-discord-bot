const db = require('../../db');
module.exports = {
	name: 'game',
	description:
		'Counts how many times you have lost the game and lets you know a few details.',
	cooldown: 5,
	guildOnly: true,
	execute(message) {
		// check if user is in the DB already
		const userId = message.author.id;
		const tableName = 'game';

		db.checkUserExists(userId, tableName).then((res) => {
			if (res.rowCount) {
				db.getUser(userId, tableName).then((result) => {
					// forEach res add to messageToSend var
					// there should only ever be 1 row...hardcode?
					// this might create a future bug, but our key is userId...
					const messageToSend = [];
					result.rows.forEach((element) => {
						const loss_count = parseInt(element.loss_count) + 1;
						const last_loss = element.last_loss.toLocalDateString();
						const first_loss = element.first_loss.toLocalDateString();
						console.dir(last_loss);
						messageToSend.push(`You've lost the game ${loss_count} times`);
						messageToSend.push(`Your last loss was on ${last_loss}`);
						messageToSend.push(`Your first loss was on ${first_loss}`);
					});
					console.dir(messageToSend);

					db.updateUser(userId, tableName);
					message.channel.send(messageToSend);
				});
			} else {
				db.addUser(userId, tableName);
				const messageToSend =
					"Oh no! You've lost the game. This is the first time. I have added you.";
				message.reply(messageToSend);
			}
		});
	},
};
