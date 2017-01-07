'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var formats_data = require(`${__dirname}/../../data/formats-data.js`)['BattleFormatsData'];

var lowKickCalcs = (number) => {
	if (number < 10) { return 20; }
	if (number < 25) { return 40; }
	if (number < 50) { return 60; }
	if (number < 100) { return 80; }
	if (number < 200) { return 100; }
	return 120;
}
				
var monGen = (num, forme) => {
	if (num >= 722 || forme === 'Alola') { return 7; } 
	else if (forme && forme in {'Mega':1, 'Mega-X':1, 'Mega-Y':1, 'Primal':1}) { return 6;} 
	else if (num >= 650) { return 6; } 
	else if (num >= 494) { return 5; } 
	else if (num >= 387) { return 4; } 
	else if (num >= 252) { return 3; } 
	else if (num >= 152) { return 2; } 
	else if (num >= 1)   { return 1; } 
	return 0;
}

module.exports = {
	desc: "Gives basic information on the stats of a Pokemon.",
	longDesc: "Gives the number, species name, typing, potential abilities, stat spread, BST, generation, weight, and tier of a Pokemon. If applicable, gives the base species and/or other formes of a Pokemon. If applicable, gives the required items and/or abilities that a Pokemon must have or cannot have. If applicable, mentions the availability of the Pokemon.",
	usage: "<Pokemon name>",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		
		let pokemon = utils.parsePokemonName(suffix);
		if (pokemon === undefined){
			let helper = utils.recognize(suffix, "pokemon");
			msg.channel.sendMessage("```" + `Pokemon "${suffix}" not recognized. Did you mean "${helper[0]}"?` + "```");
			pokemon = pokedex[helper[0]];
		}
		
		let sendMsg = `No. ${pokemon.num}: **${pokemon.species}**
Typing: ${pokemon.types[0]} ${(pokemon.types[1] || "-")}
Abilities: [1]: ${pokemon.abilities['0']}; [2]: ${(pokemon.abilities['1'] || "-")}; [H]: ${(pokemon.abilities.H || "-")}
HP/ATK/DEF/SPA/SPD/SPE: ${pokemon.baseStats.hp}/${pokemon.baseStats.atk}/${pokemon.baseStats.def}/${pokemon.baseStats.spa}/${pokemon.baseStats.spd}/${pokemon.baseStats.spe}
BST: ${(pokemon.baseStats.hp + pokemon.baseStats.atk + pokemon.baseStats.spa + pokemon.baseStats.spe + pokemon.baseStats.def + pokemon.baseStats.spd)}
Introduced in gen${monGen(pokemon.num, pokemon.forme)}
Weight: ${pokemon.weightkg} kg (${lowKickCalcs(pokemon.weightkg)} BP)`

		if (formats_data[utils.fmt(pokemon.species)].tier != undefined) {
			sendMsg += `\nTier: ${formats_data[utils.fmt(pokemon.species)].tier}`;
		} else {
			if (pokemon.baseSpecies != undefined){
				sendMsg += `\nTier: ${formats_data[utils.fmt(pokemon.baseSpecies)].tier}`;
			}
		}
		
		if (pokemon.baseSpecies != undefined){
			sendMsg += `\nBase species: ${pokedex[utils.fmt(pokemon.baseSpecies)].species}`;
		}
		if (pokemon.otherFormes != undefined){
			let otherFormHelper = [];
			pokemon.otherFormes.forEach((mon) => {
				otherFormHelper.push(pokedex[mon].species);
			});
			sendMsg += `\nOther formes: ${otherFormHelper.join(",")}`;
		}
		
		if (formats_data[utils.fmt(pokemon.species)].requiredItem) {
			sendMsg += `\nThis Pokemon must hold ${formats_data[utils.fmt(pokemon.species)].requiredItem} as an item.`;
		}
		if (formats_data[utils.fmt(pokemon.species)].requiredAbility) {
			sendMsg += `\nThis Pokemon must have the ability ${formats_data[utils.fmt(pokemon.species)].requiredAbility}.`;
		}
		if (formats_data[utils.fmt(pokemon.species)].unreleasedHidden) {
			sendMsg += `\nThis Pokemon's hidden ability is unreleased.`;
		}
		
		if (formats_data[utils.fmt(pokemon.species)].eventOnly) {
			sendMsg += `\nThis Pokemon is only available through events.`;
		}
		if (formats_data[utils.fmt(pokemon.species)].battleOnly) {
			sendMsg += `\nThis Pokemon is only available through battle.`;
		}
		
		msg.channel.sendMessage("```" + sendMsg + "```");	
	}
}





