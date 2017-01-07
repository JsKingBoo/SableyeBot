module.exports = (bot, msg, CommandManagers, config) => {
	if (msg.author.id == bot.user.id){
		return;
	}
	if (!(msg.content.startsWith(config.message.command_prefix) || msg.content.startsWith(config.message.mod_command_prefix))) {
		return;
	}
	if (msg.content.indexOf(" ") == 1 && msg.content.length > 2) {
		msg.content = msg.content.replace(" ", "");
	}
	for (let i = 0; i < CommandManagers.length; i++) {
		if (msg.content.startsWith(CommandManagers[i].prefix)) {
			return CommandManagers[i].processCommand(bot, msg);
		}
	}
}
