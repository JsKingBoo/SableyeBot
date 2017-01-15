'use strict';

//dependencies
var fs = require("fs");
var schedule = require("node-schedule");
var jsonfile = require("jsonfile");

//files
var config = require(`${__dirname}/../config.json`);
const SAVE_FILE_DIR = `${__dirname}/../logs/save.json`;
var current_session = {};
var lifetime_session = {};


//Set up save file
if (fs.existsSync(SAVE_FILE_DIR)) {
	jsonfile.readFile(SAVE_FILE_DIR, function(err, data) {
		if (err) {
			console.log(`Logger error (save file exists): ${err}`);
		}
		lifetime_session = data;
	})
} else {
	jsonfile.writeFile(SAVE_FILE_DIR, {}, function(err) {
		if (err) {
			console.log(`Logger error (save file does not exist): ${err}`);
		}
		console.log(`Creating save file ${SAVE_FILE_DIR}`);
	});
}

//Schedule
var rule = new schedule.RecurrenceRule();
rule.second = 58;
//rule.hour = 0;
var j = schedule.scheduleJob(rule, function(){
	for (let key in current_session) {
		if (!lifetime_session.hasOwnProperty(key)) {
			lifetime_session[key] = current_session[key];
		} else {
			if (typeof lifetime_session[key] != typeof current_session[key]) {
				lifetime_session[key] = current_session[key];
			} else	if (typeof lifetime_session[key] === "number") {
				lifetime_session[key] += current_session[key];
			} else {
				lifetime_session[key] = current_session[key];
			}
		}
	}
	
	jsonfile.writeFile(SAVE_FILE_DIR, lifetime_session, function(err) {
		if (err) {
			console.log(`Logger error (attempting to save session): ${err}`);
		}
	});
	
	current_session = {};
});

/**
 * Add 1 to command usage
 */
function recordUse(command) {
	if (!current_session.hasOwnProperty(command)) {
		current_session[command] = 0;
	}
	current_session[command]++;
}

module.exports = recordUse;