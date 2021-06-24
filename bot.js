const Discord = require('discord.js');
const Filter = require('./filter');
const fs = require('fs');
const config = require('./config.json');
require('dotenv').config();

const intents = new Discord.Intents();
intents.add(
	'GUILDS',
	'GUILD_MEMBERS',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS',
	'DIRECT_MESSAGES'
);
const client = new Discord.Client({ ws: { intents: intents } });
// const filter = new Filter({ emptyList: true });
const likedFilter = new Filter({ emptyList: true });

const BOT_TOKEN = process.env.BOT_TOKEN;
// const BAD_WORDS = ['gay'];

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// filter.addWords(...BAD_WORDS);
likedFilter.addWords(...config.GOOD_WORDS);

// const filterWords = (msg, filterObj) => {
// 	if (filterObj.isProfane(msg.content)) {
// 		msg.channel.send("Don't be like that!", { reply: msg });
// 		msg.delete({ reason: "don't be like that!" });
// 		const cleanedMessage = filter.clean(msg.content);
// 		msg.channel.send(
// 			`${msg.author.username}'s filtered message: ${cleanedMessage}`
// 		);
// 	}
// };

const reactToWords = (msg, filterObj) => {
	if (filterObj.isProfane(msg.content)) {
		msg.react(config.HEART_EM);
	}
};

const acceptCommands = (msg, prefix) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
		);

	if (!command) return;

	if (command.guildOnly && msg.channel.type === 'dm') {
		return msg.reply("I can't execute that command inside DMs!");
	}

	if (command.permissions) {
		const authorPerms = msg.channel.permissionsFor(msg.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return msg.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${msg.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return msg.channel.send(reply);
	}

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return msg.reply(
				`please wait ${timeLeft.toFixed(
					1
				)} more second(s) before reusing the \`${command.name}\` command.`
			);
		}
	}

	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

	try {
		command.execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
};

client.on('ready', () => {
	// eslint-disable-next-line no-console
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	// filterWords(msg, filter);
	reactToWords(msg, likedFilter);
	acceptCommands(msg, config.CMD_PREFIX);
	// msg.channel.bulkDelete(1);
});

// Create an event listener for new guild members
client.on('guildMemberAdd', async (member) => {
	const channel = member.guild.channels.cache.find(
		(ch) => ch.name === 'welcome'
	);

	const basicRole = member.guild.roles.cache.find((br) => br.name === 'newbie');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	const newUser = member.user.id;
	// Send the message, mentioning the member
	const message = await channel.send(
		`Welcome to the server, ${member}. React to this with 👌 within 15 seconds to gain access`
	);
	await message.react('👌');
	// Create a reaction collector
	const filter = (reaction, user) =>
		reaction.emoji.name === '👌' && user.id === newUser;

	message
		.awaitReactions(filter, { time: 15000 })
		// .then((collected) => console.log(`Collected ${collected.size} reactions`))
		.then((res) => {
			if (!res.size) return;
			console.log(`Collected ${res.size} reactions`);
			member.roles.add([basicRole]);
		})
		.catch(console.error);
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled promise rejection:', error);
});

client.login(BOT_TOKEN);
