'use strict';

var fs = require("fs");
var jsonfile = require("jsonfile");

var utils = require(`${__dirname}/../../utils/utils.js`);
var config = require(`${__dirname}/../../config.json`);

const SAVE_FILE_DIR = `${__dirname}/../../${config.admin.save_file}`;

module.exports = {
	desc: "Get save data.",
	usage: "<Save name>",
	process: (bot, msg, suffix, flags) => {
		if (!suffix) {
			return;
		}
		suffix = utils.fmt(suffix);
		
		if (fs.existsSync(SAVE_FILE_DIR)) {
			jsonfile.readFile(SAVE_FILE_DIR, function(err, data) {
				if (err) {
					console.log(`savedata command error: ${err}`);
				}
				if (data.hasOwnProperty(suffix)) {
					msg.channel.sendMessage("```" + `${suffix}: ${data[suffix]}` + "```");
				}
			})
		}
	}
}





