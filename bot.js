const Discord = require('discord.js');
const Filter = require('./filter');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();
const filter = new Filter({ emptyList: true });
const likedFilter = new Filter({ emptyList: true });

const BOT_TOKEN = process.env.BOT_TOKEN;
const BAD_WORDS = ['gay'];
const GOOD_WORDS = ['javascript', 'linux'];
const HEART_EM = '❤️';
const CMD_PREFIX = '!';

client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

filter.addWords(...BAD_WORDS);
likedFilter.addWords(...GOOD_WORDS);

const filterWords = (msg, filterObj) => {
	if (filterObj.isProfane(msg.content)) {
		msg.channel.send("Don't be like that!", { reply: msg });
		msg.delete({ reason: "don't be like that!" });
		const cleanedMessage = filter.clean(msg.content);
		msg.channel.send(
			`${msg.author.username}'s filtered message: ${cleanedMessage}`
		);
	}
};

const reactToWords = (msg, filterObj) => {
	if (filterObj.isProfane(msg.content)) {
		msg.react(HEART_EM);
	}
};

const acceptCommands = (msg, prefix) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	filterWords(msg, filter);
	reactToWords(msg, likedFilter);
	acceptCommands(msg, CMD_PREFIX);
	// msg.channel.bulkDelete(1);
});

client.login(BOT_TOKEN);
