'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);

module.exports = {
	desc: "List servers.",
	usage: "",
	process: (bot, msg, suffix, flags) => {
		let sendMsg = [];
		let arr = bot.guilds.array()
		sendMsg.push(`Currently watching over ${arr.length} servers:\n`);
		//Only spit out detailed list while in DM/PM channel
		if (!msg.guild) {
			for (let i = 0; i < arr.length; i++) {
				sendMsg.push(`[${i}] [${arr[i].id}] ${arr[i].name}`);
			}
		}
		utils.sendLongMessage(bot, msg, sendMsg.join("\n"), true, "\n");
	}
}





