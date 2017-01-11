'use strict';

module.exports = {
	desc: `Set status. Options are "online", "idle", "invisible", and "dnd"`,
	usage: "<status name>",
	process: (bot, msg, suffix, flags) => {
		bot.user.setStatus(suffix);
	}
}