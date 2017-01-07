'use strict';

var config = require(`${__dirname}/../../config.json`)
var aliases = require(`${__dirname}/../aliases.json`)

var utils = require(`${__dirname}/../../utils/utils.js`);

var abilities = require(`${__dirname}/../../data/abilities.js`)['BattleAbilities'];
var items = require(`${__dirname}/../../data/items.js`)['BattleItems'];
var learnsets = require(`${__dirname}/../../data/learnsets.js`)['BattleLearnsets'];
var moves = require(`${__dirname}/../../data/moves.js`)['BattleMovedex'];
var natures = require(`${__dirname}/../../data/natures.js`)['BattleNatures'];
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var typechart = require(`${__dirname}/../../data/typechart.js`)['BattleTypeChart'];
var formats_data = require(`${__dirname}/../../data/formats-data.js`)['BattleFormatsData'];
var rulesets = require(`${__dirname}/../../data/rulesets.js`)['BattleFormats'];

module.exports = {
	desc: "Evaluate an arbitrary command.",
	usage: "<expression>",
	process: (bot, msg, suffix, flags) => {
		try {
			utils.sendLongMessage(bot, msg, eval(suffix).toString());
		} catch (e) {
			utils.sendLongMessage(bot, msg, `Error evaluating command: ${e}`);
		}
	}
}





