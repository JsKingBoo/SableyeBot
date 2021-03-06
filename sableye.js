'use strict';

//Dependencies
var Discord = require('discord.js');
var fs = require('fs');

//Files
var config = require("./config.json");
var CommandManager = require('./utils/CommandManager.js');
var Logger = require("./utils/Logger.js");

//Important objects
var bot = new Discord.Client();

//"Local" variables
var events = {};
var CommandManagers = [];

function loadCommandSets() {
	return new Promise(resolve => {
		CommandManagers = [];
		CommandManagers.push(new CommandManager(config.message.command_prefix, "bot/commands/", true, false));
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
	} else if (name === 'disconnect') { //Disabled currently
		bot.on('disconnect', (err) => {
			events.disconnect(bot, config, err);
		});
	} else {
		bot.on(name, () => {
			events[name](bot, config, ...arguments);
		});
	}
}

function login() {
	bot.login(config.admin.token);	
	console.log("Launching SableyeBot");
}

function launch() {
	//initiate
	loadCommandSets()
		.then(initCommandManagers)
		.then(loadBotEvents)
		.then(login)
		.catch(error => {
			console.log("Fatal error in init " + error);
		});
}
	
module.exports = launch;