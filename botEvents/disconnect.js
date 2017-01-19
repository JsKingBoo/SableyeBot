module.exports = (bot, config, err) => {
	console.log(`DISCONNECT: ${err}`);
	
	
	//Currently buggy and could accidentally spawn multiple instances of the bot, hence commented out
	//console.log(`DISCONNECT: ${err}\nATTEMPTING TO RECONNECT...`);
	//bot.login(config.admin.token);
}
