'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var natures = require(`${__dirname}/../../data/natures.js`)['BattleNatures'];

module.exports = {
	desc: "Gives information on a certain nature, or looks up the name of a specified nature.",
	usage: "<nature name>|(<abbreviated boosted stat>, <abbreviated hindered stat>)",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		let boost = "";
		let hindr = "";
		let nature = suffix;
		//first check if it's a nature.
		for (let bst in natures) {
			let bbreak = false;
			for (let hnd in natures[bst]) {
				if (utils.fmt(natures[bst][hnd]) === nature) {
					boost = bst;
					hindr = hnd;
					bbreak = true;
					break;
				}
			}
			if (bbreak) { break; }
		}
		//is not a nature. check if it's a stat
		if (boost === "" || hindr === ""){
			suffix = suffix + ",";
			boost = utils.fmt(suffix.split(",")[0]);
			hindr = utils.fmt(suffix.split(",")[1]);
			if (!natures.hasOwnProperty(boost)){
				msg.channel.sendMessage("```" + `Argument ${boost} not recognized.` + "```");
				return;
			}
			if (!natures.hasOwnProperty(hindr)){
				msg.channel.sendMessage("```" + `Argument ${hindr} not recognized.` + "```");
				return;
			}
		}
		nature = natures[boost][hindr];
		msg.channel.sendMessage("```" + `${nature}: +${boost.toUpperCase()}, -${hindr.toUpperCase()}` + "```");
	
	}
}




