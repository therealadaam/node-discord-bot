module.exports = {
	name: 'fish',
	description:
		'Slap someone with a fish and keeps log of how many times they have been slapped.',
	aliases: ['slap', 'fishslap', 'smack'],
	usage: '[@userToSlap]',
	cooldown: 5,
	guildOnly: true,
	execute(message) {
		const data = [];
		if (!message.mentions.members) {
			message.reply(
				'I can only slap people, not roles, channels, or everyone!'
			);
		}

		// might be dumb to map and then itorate thgouh when i can just itorate through
		// the existing map...
		message.mentions.members.forEach((member, userId) => {
			// add users to slap table and/or update table
			// const hasBeenSlapped

			// add usernames to @ to data array for message
			if (!hasBeenSlapped) return;
			data.push(`@${member.user.username} has been slapped ${slapCount} times`);
		});
		message.reply("Nah bruv, I don't joke around");
	},
};
