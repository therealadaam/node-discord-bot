const Discord = require("discord.js");
var Filter = require("./filter");
require("dotenv").config();

const client = new Discord.Client();
const filter = new Filter({ emptyList: true });

const BOT_TOKEN = process.env.BOT_TOKEN;
const BAD_WORDS = ["gay"];

filter.addWords(...BAD_WORDS);

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
	if (filter.isProfane(msg.content)) {
		msg.channel.send("Don't be like that!", { reply: msg });
		msg.delete({ reason: "don't be like that!" });
		cleanedMessage = filter.clean(msg.content);
		msg.channel.send(
			`${msg.author.username}'s filtered message: ${cleanedMessage}`
		);
	}
});

client.login(BOT_TOKEN);
