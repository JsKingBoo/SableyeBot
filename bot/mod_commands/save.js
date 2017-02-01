'use strict';

var Logger = require(`${__dirname}/../../utils/Logger.js`);

module.exports = {
	desc: `Force save.`,
	usage: "",
	process: (bot, msg, suffix, flags) => {
		Logger.forceSave();
		msg.channel.sendMessage("```Saved.```");
	}
}