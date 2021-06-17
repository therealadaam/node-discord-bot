const db = require('../../db');

module.exports = {
	name: 'fish',
	description:
		'Slap someone with a fish and keeps log of how many times they have been slapped.',
	aliases: ['slap', 'fishslap', 'smack'],
	usage: '[@userToSlap]',
	cooldown: 5,
	guildOnly: true,
	execute(message, args) {
		// refactor this if to get the count they've been slapped instead of this message
		if (!args.length) {
			message.reply('You must @ mention someone to slap!');
			return;
		}
		const data = [];
		const tableName = 'fish_count';
		// console.dir(message.mentions.members);
		// console.dir(message.mentions.members.size);
		if (!message.mentions.members.size && args.length) {
			message.reply(
				'I can only slap people, not roles, channels, or everyone!'
			);
			return;
		}

		message.mentions.members.forEach((member, userId) => {
			// add users to slap table and/or update table
			// the below needs to be refactored so that it just lets the people know they've been
			// slapped. not that they've been slapped X times
			// !fish count user should do that,
			const dbResults = db.checkUserExists(userId, tableName);
			dbResults
				.then((res) => {
					// console.log(res);
					if (res.rowCount) {
						// const dbUserDetails = db.getUser(userId, tableName);
						// dbUserDetails.then((results) => {
						// 	results.rows.forEach((el) => {
						// 		// const slapCount = parseInt(el.slap_count) + 1;
						// 		console.dir(slapCount);
						// 		data.push(
						// 			`@${member.user.username} has been slapped by a fish!`
						// 		);
						// 	});
						// });
						db.updateUser(userId, tableName).catch((err) => {
							console.error(err.message);
							message.reply('something went wrong :-(');
							return;
						});
					} else {
						db.addUser(userId, tableName).catch((err) => {
							console.error(err.message);
							message.reply('something went wrong :-(');
							return;
						});
					}
				})
				.catch((err) => {
					console.error(err.message);
					message.reply('something went wrong :-(');
					return;
				});
			// console.dir(res);
			// const hasBeenSlapped
			data.push(`${member.user} has been slapped by a fish!`);
		});
		// message.reply("Nah bruv, I don't joke around");
		// console.dir(data);
		data.push('https://tenor.com/view/slap-fish-funny-gif-9229400');
		message.channel.send(data);
	},
};
