"use strict";

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)["BattlePokedex"];

module.exports = {
	desc: "Displays egg and gender information about a certain Pokemon or list all Pokemon in a certain egg group.",
	longDesc: "Displays egg and gender information about a certain Pokemon or list all Pokemon in a certain egg group. If no Pokemon or egg group is specified, list all egg groups.",
	usage: "<Pokemon name>|<egg group name>",
	process: (bot, msg, suffix, flags) => {
		
		let allEggGroups = {"amorphous":"Amorphous", "bug":"Bug", "ditto":"Ditto", "dragon":"Dragon", "fairy":"Fairy", "field":"Field", "flying":"Flying", "grass":"Grass", "humanlike":"Human-Like", "mineral":"Mineral", "monster":"Monster", "undiscovered":"Undiscovered", "water1":"Water 1", "water2":"Water 2", "water3":"Water 3"};
		if (!suffix){
			let formattedGroups = [];
			for (let egg in allEggGroups) {
				formattedGroups.push(allEggGroups[egg]);
			}
			msg.channel.sendMessage("```" + `All egg groups:\n${(formattedGroups).join(", ")}` + "```");
			return;
		}
		
		let pokemon = utils.parsePokemonName(suffix);
		if (pokemon === undefined){
			//its an egg group
			if (suffix === "water") {
				msg.channel.sendMessage("```There are three \"Water\" egg groups: Water1, Water2, and Water3. Please specify one of them.```");
				return;
			}
			if (!allEggGroups.hasOwnProperty(suffix)) {
				msg.channel.sendMessage("```" + `Pokemon or egg group ${suffix} not recognized.` + "```");
				return;
			}
			let sendMsg = `${allEggGroups[suffix]} egg group:\n\n`;
			let list = [];
			for (let mon in pokedex) {
				//remove CAP
				if (!flags.cap){
					if (pokedex[mon].num < 0){
						continue;
					}
				}
				if (!flags.missingno) {
					if (pokedex[mon].num === 0){
						continue;
					}
				}
				if (pokedex[mon].eggGroups.indexOf(allEggGroups[suffix]) >= 0) {
					list.push(pokedex[mon].species);
				}
			}		
			utils.sendLongMessage(bot, msg, sendMsg + list.join(", "));
		} else {
			let sendMsg = `${pokemon.species}:\n`;
			if (pokemon.hasOwnProperty("genderRatio")){
				sendMsg += `M: ${pokemon.genderRatio.M}; F: ${pokemon.genderRatio.F};\n`;
			} else if (pokemon.hasOwnProperty("gender")){
				sendMsg += `${pokemon.gender}: 1.0;\n`;
			} else {
				sendMsg += `M: 0.5; F: 0.5;\n`;
			}
			sendMsg += `Egg groups: ${pokemon.eggGroups.join(", ")}`;
			msg.channel.sendMessage("```" + sendMsg + "```");
		}
	}
}





