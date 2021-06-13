module.exports = {
	name: 'prune',
	description: 'Prune (delete) up to 99 messages.',
	usage: '[numberOfMessagesToRemove]',
	permissions: 'KICK_MEMBERS',
	cooldown: 5,
	execute(message, args) {
		// if (message.author.id !== '853400516537483315') {
		// 	message.reply("You don't have permission to do that");
		// }
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply("that doesn't seem to be a valid number.");
		} else if (amount <= 1 || amount > 100) {
			return message.reply('you need to input a number between 1 and 99.');
		}
		message.channel.bulkDelete(amount, true).catch((err) => {
			console.error(err);
			message.channel.send(
				'there was an error trying to prune messages in this channel!'
			);
		});
	},
};
