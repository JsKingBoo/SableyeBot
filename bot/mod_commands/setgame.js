'use strict';

module.exports = {
	desc: "Set game",
	usage: "<game name>",
	process: (bot, msg, suffix, flags) => {
		bot.user.setGame(suffix);
	}
}