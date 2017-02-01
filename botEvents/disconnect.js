var Logger = require("../utils/Logger.js");

module.exports = (bot, config, err) => {
<<<<<<< HEAD
	console.log(`DISCONNECT: ${err.code}: ${err.reason}\nATTEMPTING TO RECONNECT...`);
	/*if (err.code === 1006) {
		bot.login(config.admin.token);
	} else {
		process.exit(1);
	}*/
	Logger.forceSave();
	process.exit(1);
=======
	//console.log(`DISCONNECT: ${err.code}: ${err.reason}`);
	
	//Currently buggy and could accidentally spawn multiple instances of the bot, hence commented out
	//Gotta try it
	console.log(`DISCONNECT: ${err.code}: ${err.reason}\nATTEMPTING TO RECONNECT...`);
	bot.login(config.admin.token);
>>>>>>> origin/master
}
