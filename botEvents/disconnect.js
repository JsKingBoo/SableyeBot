var Logger = require("../utils/Logger.js");

module.exports = (bot, config, err) => {
	console.log(`DISCONNECT: ${err.code}: ${err.reason}\nATTEMPTING TO RECONNECT...`);
	/*if (err.code === 1006) {
		bot.login(config.admin.token);
	} else {
		process.exit(1);
	}*/
	Logger.forceSave();
	process.exit(1);
}
