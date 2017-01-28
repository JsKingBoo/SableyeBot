module.exports = (bot, config, err) => {
	//console.log(`DISCONNECT: ${err.code}: ${err.reason}`);
	
	//Currently buggy and could accidentally spawn multiple instances of the bot, hence commented out
	//Gotta try it
	console.log(`DISCONNECT: ${err.code}: ${err.reason}\nATTEMPTING TO RECONNECT...`);
	bot.login(config.admin.token);
}
