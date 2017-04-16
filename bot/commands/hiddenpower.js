'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var typechart = require(`${__dirname}/../../data/typechart.js`)['BattleTypeChart'];

module.exports = {
	desc: "Gives the IV settings for a certain type, or calculates the Hidden Power type given certain IVs.",
	usage: "<type>|(<hp IV>,<atk IV>,<def IV>,<spa IV>,<spd IV>,<spe IV>)",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		let IVargs = suffix.split(",");
		if (IVargs.length === 1) {
			IVargs = IVargs[0].charAt(0).toUpperCase() + IVargs[0].slice(1).toLowerCase();
			let type = typechart[IVargs];
			if (!type) {
				msg.channel.sendMessage("```" + `Type ${IVargs} not recognized.` + "```");
				return;
			}
			let ivs = type.HPivs;
			if (!ivs) {
				msg.channel.sendMessage("```" + `${IVargs} is an unattainable Hidden Power type.` + "```");
				return;
			}
			let IVset = {"hp":"odd", "atk":"odd", "def":"odd", "spa":"odd", "spd":"odd", "spe":"odd"};
			for (let stat in ivs) {
				(ivs[stat] % 2 === 1) ? IVset[stat] = "odd" : IVset[stat] = "even";
			}
			let sendMsg = [];
			for (let stat in IVset) {
				sendMsg.push(`${stat.toUpperCase()}: ${IVset[stat]}`);
			}
			msg.channel.sendMessage("```" + `${IVargs}: ${sendMsg.join(", ")}` + "```");
		} else if (IVargs.length === 6) {
			let HPtype = 0;
			let swap = IVargs[5];
			let invalid = false;
			IVargs[5] = IVargs[4];
			IVargs[4] = IVargs[3];
			IVargs[3] = swap;
			let fuckery = false;
			IVargs.forEach((value, index) => {
				if (!parseInt(value)){
					value = 0;
				}
				if (value < 0 || value > 31) {
					fuckery = true;
				}
				HPtype += (parseInt(value) % 2) * Math.pow(2, index);
			});
			if (invalid) {
				return;
			}
			HPtype = Math.floor(HPtype * 15.0 / 63);
			let typeIndex = ["Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon", "Dark"];
			let detectText = "";
			if (fuckery) {
				detectText = "\nInvalid IV value detected. However, this does not greatly affect IV calculation as only the oddity (that is, whether or not the IV value is divisible by 2) of the IV value matters in Hidden Power calculation."
			}
			msg.channel.sendMessage("```" + `Hidden Power ${typeIndex[HPtype]}${detectText}` + "```");
		} else {
			return "bad suffix";
		}
	}
}





