'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var typechart = require(`${__dirname}/../../data/typechart.js`)['BattleTypeChart'];

module.exports = {
	desc: "Provides a Pokemon's resistances, weaknesses, and immunities, ignoring abilities.",
	longDesc: "Provides a Pokemon's or a type combination's resistances, weaknesses, and immunities, ignoring abilities. Limited to two types maximum and one type minimum.",
	usage: "<Pokemon name>|(<type 1>, [type 2])",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		
		let types = Object.keys(typechart);
		let input = [];
		
		let pokemon = utils.parsePokemonName(suffix);
		if (!pokemon) {
			suffix = suffix.split(",");
			suffix.forEach((possibleType) => {
				possibleType = possibleType.charAt(0).toUpperCase() + possibleType.slice(1).toLowerCase();
				if (types.indexOf(possibleType) >= 0 && input.indexOf(possibleType) < 0) {
					input.push(possibleType);
				}
			});
			if (input.length > 2) {
				input = input.slice(0, 2);
			}
		} else {
			input = input.concat(pokemon.types);
		}	
		
		if (input.length === 0) {
			msg.channel.sendMessage("```No valid Pokemon or type recognized.```");
			return;
		}
		
		let effective = {};
		types.forEach((type) => {
			effective[type] = 1;
		});
		
		for (let typing in effective) {
			let multiplier = 1.0;
			input.forEach((type) => {
				switch (typechart[type].damageTaken[typing]) {
					case 1:
						multiplier *= 2.0;
						break;
					case 2:
						multiplier *= 0.5;
						break;
					case 3:
						multiplier = 0;
						break;
					case 0:
					default:
						break;
				}
			});
			effective[typing] = multiplier;
		}
		
		//I could definitely merge the step below with the step above, but I think it's neater to keep it seperate
		//Doesn't seem to have a huge impact on performance anyways
		let buckets = {"4.0": [], "2.0": [], "1.0": [], "0.5": [], "0.25": [], "0.0": []};
		for (let typing in effective) {
			for (let bucket in buckets) {
				if (parseFloat(bucket) == effective[typing]) {
					buckets[bucket].push(typing);
					break;
				}
			}
		}
		
		let sendMsg = [];
		sendMsg.push(`${input.join(", ")}:`);
		for (let bucket in buckets) {
			sendMsg.push(`x${bucket}: ${buckets[bucket].join(", ")}`);
		}		
		msg.channel.sendMessage("```" + sendMsg.join("\n") + "```");
	}
}





