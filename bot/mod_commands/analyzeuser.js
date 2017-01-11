'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);

module.exports = {
	desc: "Analyze user. Must be called in a channel that the user is part of.",
	usage: "<user ID>",
	process: (bot, msg, suffix, flags) => {
		let userID = suffix;
		
		let memberList = msg.guild.members;
		if (memberList.get(userID)) {
			let user = memberList.get(userID).user;
			let game = user.presence.game;
			if (game) { 
				game = user.presence.game.name;
			}
			let sendMsg = `User: ${user.username}#${user.discriminator}
ID: ${user.id}
Created: ${user.createdAt.toString()}
Avatar link: ${user.displayAvatarURL}
Currently ${user.presence.status} playing "${game}"`;
			
			utils.sendLongMessage(bot, msg, sendMsg, true, "\n");
		} else {
			utils.sendLongMessage(bot, msg, "No user found.", true);
		}
		
	}
}