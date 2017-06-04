'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];

module.exports = {
	desc: "Gives evolution data of a Pokemon.",
	longDesc: "Gives potential evolutions and the prerequisites of the evolution of the Pokemon. This command does not look past the direct evolution, and this command does not attempt to find prevolution.",
	usage: "<Pokemon name>",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		
		let pokemon = utils.parsePokemonName(suffix);
		if (pokemon === undefined){
			let helper = utils.recognize(suffix, "pokemon");
			msg.channel.sendMessage("```" + `Pokemon "${suffix}" not recognized. Did you mean "${helper.item.species}"?` + "```");
			pokemon = helper.item;
		}
		
		let sendMsg = [];
		sendMsg.push(`**${pokemon.species}**:`);
		if (pokemon.hasOwnProperty("evos")) {
			let evoHelper = [];
			for (let evo of pokemon.evos) {
				evoHelper.push(pokedex[evo].species);
			}
			sendMsg.push(`Evolutions: ${evoHelper.join(", ")}`)
		} else {
			sendMsg.push("This Pokemon does not evolve.");
		}
		
		if (pokemon.hasOwnProperty("evoLevel")) {
			if (pokemon.evoLevel == 1) {
				sendMsg.push("This Pokemon evolved from an item.");
			} else if (pokemon.evoLevel == 2) {
				sendMsg.push("This Pokemon evolved from high Happiness.");
			} else {
				sendMsg.push(`This Pokemon evolved at level ${pokemon.evoLevel}.`);
			}
		} else {
			sendMsg.push("This Pokemon does not evolve from another Pokemon.")
		}
		
		msg.channel.sendMessage("```" + sendMsg.join("\n") + "```");	
	}
}





