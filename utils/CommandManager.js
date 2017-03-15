'use strict';

//Dependencies
var fs = require('fs');
var RateLimiter = require("limiter").RateLimiter;

//Files
var Command = require('./Command.js');
var utils = require("./utils.js");
var aliases = require(`${__dirname}/../bot/aliases.json`);
var config = require(`${__dirname}/../config.json`);

/**
 * @class
 * @classdesc 								Handles a directory of .js files
 * @prop {String} 			dir 			Path where the commands are located relative to the root directory.
 * @prop {Object<Command>} 	commands 		The loaded {@link Command}s.
 */
 
class CommandManager {
	/**
	 * @constructor
	 * @arg {String} 		prefix 			The bot's prefix. 
	 * @arg {String} 		dir 			Path to load command from, relative to the root directory of the bot.
	 */
	constructor(prefix, dir, clean = true, whitelist = false) {
		//dir = "bot/commands" or "bot/mod_commands"
		this.prefix = prefix;
		this.directory = `${__dirname}/../${dir}`;
		this.commands = {};
		this.clean = clean;
		this.whitelist = whitelist;
	}
	
	/**
	 * Initialize the command manager, loading each command in the set directory.
	 * @arg {Client} 		bot
	 * @returns {Promise}
	 */
	init(bot) {
		return new Promise((resolve, reject) => {
			fs.readdir(this.directory, (err, files) => {
				if (err) {
					reject(`Error reading commands directory: ${err}`);
				}
				else if (!files) {
					reject(`No files in directory ${this.directory}`);
				} else {
					for (let name of files) {
						if (name.endsWith('.js')) {
							try {
								name = name.replace(/\.js$/, '');
								let command = new Command(name, this.prefix, require(this.directory + name + '.js'), bot);
								this.commands[name] = command;
							} catch (e) {
								console.log(`CommandManager init() error: ${e} while parsing ${name}.js`);
							}
						}
					}
					resolve();
				}
			});
		});
	}
	
	/**
	 * Called when a message is detected with the prefix. Decides what to do.
	 * @arg {Client} 		bot 			The client.
	 * @arg {Message} 		msg 			The matching message.
	 */
	processCommand(bot, msg) {
		if (this.whitelist) {
			if (config.admin.whitelisted_users.indexOf(parseInt(msg.author.id, 10)) < 0) {
				//msg.channel.sendMessage("```You are not authorized to use that command.```");
				return;
			}
		}
		
		//parsing the following message
		// {prefix}{name} {suffix+flags}
		let name = msg.content.split(" ")[0].replace(/\n/g, " ").substring(this.prefix.length).toLowerCase();
		let command;
		
		//command confirmed existing, continue parsing suffix
		let suffix = [];
		let suffixHelper = msg.content.replace(/\n/g, " ").substring(name.length + this.prefix.length + 1).trim().split(" ");
		let flags = {};
		for (let falg in config.data) {
			flags[falg] = config.data[falg];
		}
		suffixHelper.forEach((item) => {
			let isFlag = false;
			if (item.startsWith(config.message.flag_prefix)) {
				let cutOffPrefix = item.substr(config.message.flag_prefix.length);
				if (flags.hasOwnProperty(cutOffPrefix)) {
					flags[cutOffPrefix] = !flags[cutOffPrefix];
					isFlag = true;
				}
			}			
			if (!isFlag){
				suffix.push(item);
			}
		}); 
		
		suffix = suffix.join(" ");
		if (this.clean) {
			//Need to preserve '-' for negative number input
			//Cannot directly change utils.format because - is needed to parse Pokemon names
			//e.g. Sableye-Mega
			suffix = suffix.trim().toLowerCase().replace(/[^0-9a-z,=<>!\-]/gi, '')
		}
		//parse name for aliases
		let validName = false;
		if (aliases.hasOwnProperty(name)){
			name = aliases[name];
			//validName = true;
		}
		if (name === "help") {
			validName = true;
		}
		//search if name is a valid command
		for (let key in this.commands) {
			if (key === name) {
				command = this.commands[key];
				validName = true;
				break;
			}
		}
		if (!validName) {
			return;
		}
	
		if (name === 'help') {
			this.help(bot, msg, suffix, flags);
		} else {
			let serverSent = msg.guild;
			if (!serverSent) {
				serverSent = "DM/PM Channel";
			}
			command.execute(bot, msg, suffix, flags);
		}
	}
	
	/**
	 * Built-in help command. If no command is specified it will DM/PM a list of commands. If a command is specified it will send info on that command.
	 * @arg {Client} 		bot 				The client.
	 * @arg {Message} 		msg 				The message that triggered the command.
	 * @arg {String} 		[suffix] 			The command to get help for.
	 * @arg {Object} 		[flags] 			Flag object. Currently completely useless.
	 */
	help(bot, msg, suffix, flags) {
		//Check if suffix exists. If it does not, return a list of all commands
		if (!suffix) {
			//code here
			let sendMsg = `Use "${this.prefix}help <command name>" to get more information on a specific command.\n\n**Command List: (${Object.keys(this.commands).length})**`;
			for (let command in this.commands) {
				if (!command.do_not_display) {
					sendMsg += `\n${this.prefix}${this.commands[command].name} ${this.commands[command].usage}\n\t#${this.commands[command].desc}`;
					//sendMsg += `Use "${this.prefix}help ${this.commands[command].name}" for more information.`;
				}
			}
			
			utils.sendLongMessage(bot, msg, sendMsg, true, "\n");
			
		} else {
			//Check if suffix is a valid command
			let command;
			let validCommand = false;
			if (aliases.hasOwnProperty(suffix)){
				suffix = aliases[suffix];
			}
			for (let key in this.commands) {
				if (key === suffix) {
					command = this.commands[key];
					validCommand = true;
					break;
				}
			}
			
			//Valid command, return info on command
			if (validCommand) {
				let otherNames = [];
				for (let alias in aliases) {
					if (aliases[alias] === command.name) {
						otherNames.push(alias);
					}
				}
				if (otherNames.length === 0) {
					otherNames.push("-");
				}
				utils.sendLongMessage(bot, msg, `Usage: ${this.prefix}${suffix} ${command.usage}\n\t#${command.longDesc || command.desc}\nAliases: ${otherNames.join(", ")}`);	
			} else if (suffix === "help") { 
				//Not too happy with this hack
				msg.channel.sendMessage("```" + `Usage: ${this.prefix}help [command name]\n\t#List all commands, or look up information about another command.\nAliases: -` + "```");
			} else {
				msg.channel.sendMessage("```" + `Command ${suffix} not found.` + "```");
			}
		}
	}
	
}

module.exports = CommandManager;







