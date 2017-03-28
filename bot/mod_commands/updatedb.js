'use strict';

var http = require('http');
var fs = require('fs');
var events = require('events');

var config = require(`${__dirname}/../../config.json`)
var aliases = require(`${__dirname}/../aliases.json`)

var utils = require(`${__dirname}/../../utils/utils.js`);
var Logger = require(`${__dirname}/../../utils/Logger.js`);

const DIRECTORY = `${__dirname}/../../data/`;
var FILE_NAMES = ['abilities', 'items', 'learnsets', 'moves', 'pokedex', 'typechart', 'formats-data'];

module.exports = {
	desc: "Update all databases, then reboots SableyeBot.",
	usage: "",
	process: (bot, msg, suffix, flags) => {
		var emitter = new events.EventEmitter();
		let count = FILE_NAMES.length;
		emitter.on('count', () => {
			count--;
			if (count <= 0) {
				//reboot
				msg.channel.sendMessage("```Updated database. Restarting...```")
					//Ends up being unresponsive, possibly due to rate limiting.
					/*.then(() => {
						bot.user.setGame('Rebooting...')
					})
					.then(() => {
						bot.user.setStatus('dnd');
					})*/
					/*.then(() => {
						Logger.forceSave();
					})*/
					.then(() => {
						process.exit(1);
					})
			}
		});
		
		for (let i = 0; i < FILE_NAMES.length; i++){
			let currentFile = FILE_NAMES[i];
			let currentDirectory = `${DIRECTORY}${currentFile}.js`;
			
			let file = fs.createWriteStream(currentDirectory);
			http.get(`http://play.pokemonshowdown.com/data/${currentFile}.js`, function(response) {
				response.pipe(file);
				file.on('finish', function() {
					file.close(() => {
						console.log('reloaded', currentFile);
						emitter.emit('count');
					});  // close() is async, call cb after close completes.
				});
			}).on('error', function(err) { // Handle errors
				fs.unlink(currentDirectory); // Delete the file async. (But we don't check the result) lul
				console.log(err);
			});
		}
	}
}





