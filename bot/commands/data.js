'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var abilities = require(`${__dirname}/../../data/abilities.js`)['BattleAbilities'];
var moves = require(`${__dirname}/../../data/moves.js`)['BattleMovedex'];
var items = require(`${__dirname}/../../data/items.js`)['BattleItems'];
var natures = require(`${__dirname}/../../data/natures.js`)['BattleNatures'];

var pokedexjs = require("./pokedex.js");
var abilityjs = require("./ability.js");
var movejs = require("./move.js");
var itemjs = require("./item.js");
var naturejs = require("./nature.js");

//Preload
let naturesArr = [];
for (let bst in natures) {
	for (let hnd in natures[bst]) {
		naturesArr.push(natures[bst][hnd].toLowerCase());
	}
}

module.exports = {
	desc: "Helper command for informational commands.",
	longDesc: "A single command that serves as the pokedex, ability, move, item, and nature commands all in one.",
	usage: "(<Pokemon name>|<ability name>|<move name>|<item name>|<nature name>)",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		} 
		
		if (naturesArr.indexOf(suffix) > -1) {
			naturejs.process(bot, msg, suffix, flags);
		} else if (utils.parsePokemonName(suffix)) {
			pokedexjs.process(bot, msg, suffix, flags);
		} else if (abilities[suffix]) {
			abilityjs.process(bot, msg, suffix, flags);					
		} else if (moves[suffix]) {
			movejs.process(bot, msg, suffix, flags);					
		} else if (items[suffix]){
			itemjs.process(bot, msg, suffix, flags);					
		} else {
			let helper = utils.recognize(suffix);
			msg.channel.sendMessage("```" + `Did not recognize "${suffix}". Did you mean "${helper.id}"?` + "```");
			let infoCommands = [pokedexjs, abilityjs, movejs, itemjs];
			let types = ['pokemon', 'ability', 'move', 'item'];
			infoCommands[types.indexOf(helper.type)].process(bot, msg, helper.id, flags);
		}
		
	}
}





