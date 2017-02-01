'use strict';

var config = require(`${__dirname}/../config.json`);
var Logger = require(`./Logger.js`);

//thanks unlucky4ever/Witty, hearts and kisses
/**
 * @class
 * @classdesc 								Represents a command for the client.
 * @prop {String} 			name 			The command's name.
 * @prop {String} 			prefix 			Prefix for the command.
 * @prop {String} 			usage 			Usage for the command; a list of parameters that the user inputs.	
 * @prop {String} 			desc 			Short description of what the command does.
 * @prop {String} 			help 			Detailed description of what the command does.
 * @prop {Function} 		process			The function to execute when the command is called.
 * @prop {Boolean} 			do_not_display	If the command should be hidden from help.
 * @prop {Boolean} 			ownerOnly 		If the command can only be used by a bot admin.
 * @prop {Function} 		destroyFunction A function that runs at decontruction.
 */
class Command {
	/**
	 * @constructor
	 * @arg {String} 		name 			Name of the command.
	 * @arg {String} 		prefix 			Prefix of the command.
	 * @arg {Object} 		cmd 			Object containing the appropriate properties including the function to run.
	 * @arg {String} 		[cmd.usage=""]
	 * @arg {String} 		[cmd.desc="No description"]
	 * @arg {String} 		[cmd.longDesc="No description"]
	 * @arg {String} 		[cmd.help="No description"]
	 * @arg {Function} 		cmd.process		Function that a command invokes
	 * @arg {Boolean} 		[cmd.do_not_display=false]
	 * @arg {Boolean} 		[cmd.ownerOnly=false]
	 * @arg {Function} 		[cmd.destroy] 	A function that runs at destruction.
	 * @arg {Client} 		bot 			The client.
	 */
	constructor(name, prefix, cmd, bot) {
		this.name = name;
		this.prefix = prefix;
		this.usage = cmd.usage || "";
		this.desc = cmd.desc || "No description.";
		this.longDesc = cmd.longDesc || this.desc;		
		this.process = cmd.process;
		this.do_not_display = !!cmd.do_not_display;
		this.ownerOnly = !!cmd.ownerOnly;
		this.destroyFunction = cmd.destroy;

		if (typeof cmd.initialize === "function") {
			cmd.initialize(bot);
		}
	}

	/**
	 * Execute the command. If the command returns "wrong usage" will show the {@link Command#correctUsage}
	 * @arg {Client} bot The client.
	 * @arg {Message} msg The message that triggered it.
	 * @arg {String} suffix The text after the command (args).
	 * @arg {Object} flags The flags object.
	 */
	execute(bot, msg, suffix, flags) {
		
		let result;
		try {
			result = this.process(bot, msg, suffix, flags); // Run the command.
		} catch (err) {
			if (config.message.errorMessage) {
				msg.channel.sendMessage(config.errorMessage);
			}
		}
		
		//bad suffix
		if (result === "bad suffix") {
			msg.channel.sendMessage("```" + `Usage: ${this.prefix}${this.name} ${this.usage}` + "```");
		} else {
			Logger.record(this.name);
		}
	}
	
	destroy() {
		if (typeof this.destroyFunction === "function") {
			this.destroyFunction();
		}
	}

}

module.exports = Command;
