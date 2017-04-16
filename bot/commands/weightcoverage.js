'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var typechart = require(`${__dirname}/../../data/typechart.js`)['BattleTypeChart'];

module.exports = {
	desc: "Provides coverage versus all current Pokemon typings.",
	longDesc: "Provides a Pokemon's or a moveset's coverage versus all current Pokemon typings, ignoring abilities.",
	usage: "<Pokemon name>|(<type 1>, [type 2], [type 3], [type 4])",
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
			if (input.length > 4) {
				input = input.slice(0, 4);
			}
		} else {
			input = input.concat(pokemon.types);
		}	
		
		if (input.length === 0) {
			msg.channel.sendMessage("```No valid Pokemon or type recognized.```");
			return;
		}
		
		/*0 = neu
		1 = double dmg			
		2 = half dmg
		3 = immune*/
		let effectivenessHelper = (id) => {
			switch (id) {
				case 0: return 1.0;
				case 1: return 2.0;
				case 2: return 0.5;
				case 3: return 0.0;
			}
		}
		
		let buckets = {"4.0": 0, "2.0": 0, "1.0": 0, "0.5": 0, "0.25": 0, "0.0": 0};
		let total = 0;
		
		for (let pokemonKey in pokedex) {
			let pokemon = pokedex[pokemonKey];
			if (!flags.cap && pokemon.num < 0){
				continue;
			}
			if (!flags.missingno && pokemon.num === 0){
				continue;
			}
			if (flags.alola) {
				if (!(pokemon.baseSpecies in utils.alolaDex) && !(pokemon.species in utils.alolaDex)){
					continue;
				}
				if (!(pokemon.species in utils.alolaDex)){
					continue;
				}
			}
			
			let maxEffective = -1.0;
			input.forEach((type) => {
				let testMax = 1.0;
				for (let typing of pokemon.types) {
					testMax *= effectivenessHelper(typechart[typing].damageTaken[type]);
				}	
				maxEffective = Math.max(testMax, maxEffective);
			});
			total++;
			for (let bucket in buckets) {
				if (maxEffective === parseFloat(bucket)) {
					buckets[bucket]++;
					break;
				}
			}		
		}
		
		let sendMsg = [];
		sendMsg.push(`${input.join(", ")}:`);
		for (let bucket in buckets) {
			sendMsg.push(`x${bucket}: ${buckets[bucket]}`);
		}		
		msg.channel.sendMessage("```" + sendMsg.join("\n") + "```");
	}
}





