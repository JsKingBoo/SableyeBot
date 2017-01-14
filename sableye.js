'use strict';

//Dependencies
var Discord = require("discord.js");
var fs = require('fs');

//Files
var config = require("./config.json");
var CommandManager = require('./utils/CommandManager.js');

//Important objects
var bot = new Discord.Client();

//Local variables
var logger;
var events = {};
var CommandManagers = [];

function loadCommandSets() {
	return new Promise(resolve => {
		CommandManagers = [];
		CommandManagers.push(new CommandManager(config.message.command_prefix, "bot/commands/"));
		CommandManagers.push(new CommandManager(config.message.mod_command_prefix, "bot/mod_commands/", false, true));
		resolve();
	});
}

function initCommandManagers(index = 0) {
	return new Promise((resolve, reject) => {
		CommandManagers[index].init(bot).then(() => {
			index++;
			if (CommandManagers.length > index) {
				initCommandManagers(index).then(resolve).catch(reject);
			} else {
				resolve();
			}
		}).catch(reject);
	});
}

function loadBotEvents() {
	return new Promise((resolve, reject) => {
		fs.readdir(`${__dirname}/botEvents/`, (err, files) => {
			if (err) {
				reject(`Error reading events directory: ${err}`);
			} else if (!files) {
				reject('No files in directory events/');
			} else {
				for (let name of files) {
					if (name.endsWith('.js')) {
						name = name.replace(/\.js$/, '');
						try {
							events[name] = require(`${__dirname}/botEvents/${name}.js`)
							initBotEvent(name);
						} catch (e) {
							console.log(`loadBotEvents() error: ${e}`);
						}
					}
				}
				resolve();
			}
		});
	});
}

function initBotEvent(name) {
	if (name === 'message') {
		bot.on('message', (msg) => {
			events.message(bot, msg, CommandManagers, config);
		});
	} else if (name === 'ready') {
		bot.on('ready', () => {
			events.ready(bot, config);
		});
	} else {
		bot.on(name, function() {
			events[name](bot, settingsManager, config, ...arguments);
		});
	}
}

function login() {
	bot.login(config.admin.token);	
	console.log("Launching SableyeBot");
}

//initiate
loadCommandSets()
	.then(initCommandManagers)
	.then(loadBotEvents)
	.then(login)
	.catch(error => {
		console.log("Fatal error in init " + error);
	});