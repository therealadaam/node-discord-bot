module.exports = {
	name: 'mute',
	description: 'Tag a member to mute them for the specified amount of minutes.',
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	usage: '[@userToMute <minutesToMute>]',
	args: true,
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to mute them!');
		}
		// console.log(`${args.length}`);
		if (args.length < 2) {
			return message.reply('you need to specify how long to mute them!');
		}

		const mutedRoleId = '856796084536737792';
		const mutedRole = message.guild.roles.cache.get(mutedRoleId);
		const timeInMinutes = args[1];
		const timeInMS = timeInMinutes * 60 * 1000;
		const taggedUser = message.mentions.members.first();

		// get existing roles
		// console.log(taggedUser);
		const oldRoles = taggedUser.roles.cache.clone();
		// console.log(mutedRole);

		taggedUser.roles.set([mutedRole]);

		message.channel.send(
			`${taggedUser.user.username} is in timeout and has been muted for ${timeInMinutes}`
		);
		taggedUser.send(
			`You're in timeout! You can talk in #shit-posting and that's it.`
		);

		setTimeout(() => {
			// console.dir(oldRoles);
			// console.dir([oldRoles]);
			taggedUser.roles.set(oldRoles);
		}, timeInMS);
	},
};
