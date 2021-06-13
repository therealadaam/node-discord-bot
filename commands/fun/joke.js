const fetch = require('node-fetch');
module.exports = {
	name: 'joke',
	description: 'Might tell jokes one day',
	execute(message) {
		message.reply("Nah bruv, I don't joke around");
		const replyMessage = async () => {
			const url = 'https://api.chucknorris.io/jokes/random';
			const res = await fetch(url);
			const joke = await res.json();
			return `Just kidding, here you go\n${joke.value}`;
		};
		setTimeout(() => {
			const replyText = replyMessage();
			message.reply(replyText);
		}, 1000);
	},
};
