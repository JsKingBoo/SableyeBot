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


module.exports = {
	desc: "Helper command for informational commands.",
	longDesc: "A single command that serves as the pokedex, ability, move, item, and nature commands all in one.",
	usage: "<Pokemon name>|<ability name>|<move name>|<item name>|<nature name>",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		} 
		
		//preload this so it doesn't break
		let isANature = false;
		for (let bst in natures) {
			let bbreak = false;
			for (let hnd in natures[bst]) {
				if (utils.fmt(natures[bst][hnd]) === suffix) {
					isANature = true;
				}
			}
			if (bbreak) { break; }
		}
		
		if (isANature) {
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
			msg.channel.sendMessage("```" + `Did not recognize "${suffix}". Did you mean "${helper[0]}"?` + "```");
			let infoCommands = [pokedexjs, abilityjs, movejs, itemjs];
			let types = ["pokemon", "ability", "move", "item"];
			infoCommands[types.indexOf(helper[2])].process(bot, msg, helper[0], flags);
		}
		
	}
}





