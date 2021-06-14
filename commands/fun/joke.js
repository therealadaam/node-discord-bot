const fetch = require('node-fetch');
module.exports = {
	name: 'joke',
	description: 'Might tell jokes one day',
	execute(message) {
		message.reply("Nah bruv, I don't joke around");
		const url = 'https://api.chucknorris.io/jokes/random';
		fetch(url)
			.then((res) => res.json())
			.then((json) => message.reply(`Just kidding, here ya go\n${json.value}`))
			.catch((err) => console.log(err));
	},
};
