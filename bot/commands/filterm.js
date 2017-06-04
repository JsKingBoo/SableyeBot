'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);

//Pokemon databases
var abilities = require(`${__dirname}/../../data/abilities.js`)['BattleAbilities'];
var items = require(`${__dirname}/../../data/items.js`)['BattleItems'];
var learnsets = require(`${__dirname}/../../data/learnsets.js`)['BattleLearnsets'];
var moves = require(`${__dirname}/../../data/moves.js`)['BattleMovedex'];
var natures = require(`${__dirname}/../../data/natures.js`)['BattleNatures'];
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var typechart = require(`${__dirname}/../../data/typechart.js`)['BattleTypeChart'];
var formats_data = require(`${__dirname}/../../data/formats-data.js`)['BattleFormatsData'];
var rulesets = require(`${__dirname}/../../data/rulesets.js`)['BattleFormats'];

let operatorCompare = {
	'>': (a, b) => {return a > b},
	'>=': (a, b) => {return a >= b},
	'=': (a, b) => {return a === b},
	'==': (a, b) => {return a === b},
	'<=': (a, b) => {return a <= b},
	'<': (a, b) => {return a < b},
	'<>': (a, b) => {return a != b},
	'!=': (a, b) => {return a != b}
};

let alphanumeric = (str) => {
	return str.toLowerCase().replace(/[^0-9a-z]/gi, '');
}

let multiValueChecker = (operator, multiValue, value) => {
	/*
	Iterates through a list to check if it's equal. "=" is treated as OR while "<>" is treated as AND
	For example, if abilities = [Magic Guard, Unaware] then = will return true when at least one matches, while <> returns false if at least one of them match.
	Fun fact: before I rewrote everything, this function was originally named "spaghettiHelper"
	*/
	let isEqual = operatorCompare[operator](1, 1);
	if (multiValue.constructor === [].constructor) {
		for (let i = 0; i < multiValue.length; i++) {
			if (alphanumeric(multiValue[i]+"") === alphanumeric(value+"")) {
				return isEqual;
			}
		}
	} else if (multiValue.constructor === {}.constructor) {
		for (let i in multiValue) {
			if (alphanumeric(multiValue[i]+"") === alphanumeric(value+"")) {
				return isEqual;
			}
		}
	}
	return !isEqual;
};

let falseValues = {
	'false': false,
	'0': false,
	'null': false,
	'undefined': false,
	'': false
};

module.exports = {
	desc: "Search moves based on user-inputted parameters.",
	longDesc: `Search moves based on user-inputted parameters. Availible parameters are:
basePower (bp) - Base power of move. e.g. "basePower=90",
type - Type of move. e.g. "type=ghost",
accuracy (acc) - Accuracy of move. Set greater than 100 for moves that do not check for accuracy. e.g. "accuracy=100",	
category (cat) - Category. Options are "physical" (0), "special" (1), or "status" (2). e.g. "category=0",
powerPoint (pp) - Number of times a move may be used before it runs out of uses. e.g. "pp=10",
priority - Priority. e.g. "priority=-7",
flags - Flags. Available options are: authentic, bite, bullet, charge, contact, dancer, defrost, distance, gravity, heal, mirror, nonsky, powder, protect, pulse, punch, recharge, reflectable, snatch, sound. e.g. "flags=authentic",
target - Targeting options. Available options are: normal, allAdjacentFoes, allAdjacent, any, self, adjacentAlly, all, allySide, foeSide, randomNormal. e.g. "target=normal",
secondaryChance - Chance that the secondary can be applied, in percent. 0 for moves that do not have a secondary effect. e.g. "secondaryChance=100",
boosts - Increased or decreased stat when used. Available options are: atk, def, spa, spd, spe, evasion, accuracy. e.g. "boost=def",
status - Non-volatile status. Available options are: burn, freeze, paralysis, poison, sleep, toxic. e.g. "status=burn",
volatileStatus - Volatile status. Available options are: attract, confusion, curse, embargo, encore, flinch, foresight, healblock, leechseed, miracleeye, nightmare, partiallytrapped, taunt, telekinesis, torment. e.g. "volatileStatus=flinch",
drain - Whether a move heals the user based on the damage dealt. Accepts any valid boolean input. e.g. "drain=true",
isViable - Whether a move is considered viable. Accepts any valid boolean input. e.g. "isViable=true",
contestType (contest) - Contest category. Available options are: cool, beautiful, cute, clever, tough. e.g. "contestType=cool",
learn - A Pokemon that learns the move. Moves learned by Sketch are ignored. e.g. "learn=sableye",
zMovePower - Power of move when powered up with a Z-Crystal. 0 for Z-moves that do not deal damage. e.g. "zMovePower=120",
zMoveBoost - Increased stat when powered up with Z-Crystal. Available options are: atk, def, spa, spd, spe, evasion, accuracy. e.g. "zMoveBoost=atk",
zMoveEffect - Effect of using a Z-Crystal on this move. Available options are: clearnegativeboost, crit2, curse, heal, healreplacement, redirect
num - Move index number. Usually useless. e.g. "num=302",
threshold - Number of parameters that the Pokemon must fulfill, not including this one or "sort". e.g. "threshold>=2",
sort - The argument that the list will be sorted by in ascending order. e.g. "sort=atk",
EXAMPLE: "//filterm bp>60,type=dark,cat=0"
`,
	usage: "<parameter list>",
	process: (bot, msg, suffix, flags) => {		
		if (!suffix){
			return "bad suffix";
		}
		
		suffix = suffix.split(",");
		let parameterList = [];
		let sortParameters = [];
		let threshholdObject = undefined;
		let sendMsg = [];
		
		//Parse parameters
		for (let parameterIndex = 0; parameterIndex < suffix.length; parameterIndex++) {
			let parameter = suffix[parameterIndex];
			let parameterTemplate = {"key": "", "value": "", "operator": "", "hasCustomParsing": false };
			let valid = -1;
			let charIndex = 0;
		
			while (parameter.charAt(charIndex) === parameter.charAt(charIndex).replace(/[^a-z]/gi, '')) {
				parameterTemplate.key += parameter.charAt(charIndex);
				charIndex++;
				if (charIndex >= parameter.length) {
					valid = 1;
					break;
				}
			}
			if (parameterTemplate.key.length === 0) {
				valid = 1;
			}
			
			while (parameter.charAt(charIndex) === parameter.charAt(charIndex).replace(/[^=<>!]/gi, '') && valid < 0) {
				parameterTemplate.operator += parameter.charAt(charIndex);
				charIndex++;
				if (charIndex >= parameter.length) {
					valid = 2;
					break;
				}
			}
			if (!operatorCompare.hasOwnProperty(parameterTemplate.operator) && valid < 0){
				valid = 2;
			}
			
			parameterTemplate.value = parameter.substr(charIndex);
			if (parameterTemplate.value.length === 0 && valid < 0) {
				valid = 3;
			}
			
			if (valid > 0) {
				let errorMessage = "";
				switch (valid) {
					case 3:
						errorMessage = "Argument value not given.";
						break;
					case 2:
						errorMessage = "Argument operator not found.";
						break;
					case 1:
					default:
						errorMessage = "Argument key not valid.";
						break;
				}
				sendMsg.push(`Ignoring argument "[${parameterIndex+1}] ${parameter}" due to parsing error: ${errorMessage}\n`);
				continue;
			}
			
			let customs = ["bp", "basepower", "acc", "cat", "category", "powerpoint", "flags", "flag", "learn", "secondarychance", "boost", "boosts", "status", "volatilestatus", "drain", "isviable", "contesttype", "contest", "zmovepower", "zmoveboost", "zmoveeffect", "threshold","threshhold","sort"];
			if (customs.indexOf(parameterTemplate.key) >= 0) {
				parameterTemplate.hasCustomParsing = true;
			}
		
			if (parameterTemplate.hasCustomParsing) {
				//Note: some fall down
				switch (parameterTemplate.key) {
					case "bp":
					case "basepower":
						parameterTemplate.key = "basePower";
						parameterTemplate.hasCustomParsing = false;
						break;
					case "acc":
						parameterTemplate.key = "accuracy";
						parameterTemplate.hasCustomParsing = false;
						break;
					case "cat":
					case "category":
						parameterTemplate.key = "category";
						switch (parameterTemplate.value) {
							case "1":
								parameterTemplate.value = "special";
								break;
							case "2":
								parameterTemplate.value = "status";
								break;
							case "0":
							default:
								parameterTemplate.value = "physical";
						}
						parameterTemplate.hasCustomParsing = false;
						break;
					case "powerpoint":
						parameterTemplate.key = "pp";
						parameterTemplate.hasCustomParsing = false;
						break;
					case "flag":
						parameterTemplate.key = "flags";
						break;
					case "secondarychance":
						parameterTemplate.key = "secondaryChance";
						break;
					case "boost":
						parameterTemplate.key = "boosts";
						break;
					case "status":
						switch (parameter.value) {
							case "burn":
								parameter.value = "brn";
								break;
							case "freeze":
								parameter.value = "frz";
								break;
							case "paralysis":
								parameter.value = "par";
								break;
							case "poison":
								parameter.value = "psn";
								break;
							case "sleep":
								parameter.value = "slp";
								break;
							case "toxic":
								parameter.value = "tox";
								break;
							default:
						}
						break;
					case "volatilestatus":
						parameterTemplate.key = "volatileStatus";
						break;
					case "isviable":
						parameterTemplate.key = "isViable";
						break;
					case "contesttype":
					case "contest":
						parameterTemplate.key = "contestType";
						parameterTemplate.hasCustomParsing = false;
						break;
					case "zmovepower":
						parameterTemplate.key = "zMovePower";
						break;
					case "zmoveboost":
						parameterTemplate.key = "zMoveBoost";
						break;
					case "zmoveeffect":
						parameterTemplate.key = "zMoveEffect";
						parameterTemplate.hasCustomParsing = false;
						break;
					case "threshhold":
						parameterTemplate.key = "threshold";
						break;
					default:
				}
			}
			
			if (parameterTemplate.key === "threshold" && threshholdObject === undefined){
				threshholdObject = parameterTemplate;
				threshholdObject.value = parseInt(threshholdObject.value);
				sendMsg.push(`[${(parameterIndex+1)}] Looking for moves that satisfy ${threshholdObject.operator}${threshholdObject.value} argument(s).\n`);
			} else if (parameterTemplate.key === "sort") {
				parameterTemplate.operator = "=";
				sortParameters.push(parameterTemplate);
				sendMsg.push(`[${(parameterIndex+1)}] Sorting moves by argument key ${parameterTemplate.value}.\n`);
			} else if (parameterTemplate.key != "threshold") {
				parameterList.push(parameterTemplate);
				sendMsg.push(`[${(parameterIndex+1)}] ${parameterTemplate.key}${parameterTemplate.operator}${parameterTemplate.value}\n`);
			}			
		}
		
		sendMsg.push("\n");
		if (parameterList.length === 0){
			sendMsg.push("No valid arguments given.");
			utils.sendLongMessage(bot, msg, sendMsg.join(""));
			return;
		}
		
		//END "Parse parameter list"
		
		//Iterate through all moves, then place them in buckets determined by how many parameters they satisfy
		//Store move name rather than move object to lessen processing power
		let moveMatch = [];
		for (let i = 0; i <= parameterList.length; i++) {
			moveMatch.push([]);
		}
		
		for (let moveKey in moves) {
			let move = moves[moveKey];
			if (move.isNonstandard && !flags.cap) {
				continue;
			}
			
			let fitParameter = 0;
			//Iterate through all the parameters and see how many the move matches
			for (let parameterIndex = 0; parameterIndex < parameterList.length; parameterIndex++) {
				let parameter = parameterList[parameterIndex];
				if (!parameter.hasCustomParsing) {
					if (!move.hasOwnProperty(parameter.key)) {
						continue;
					}
					let moveProp = move[parameter.key];
					if (typeof moveProp === "number") {
						parameter.value = parseInt(parameter.value);
					} else {
						moveProp = alphanumeric(moveProp);
					}
					if (operatorCompare[parameter.operator](moveProp, parameter.value)) {
						fitParameter++;
					}
				} else {
					//Note: some fall down
					let found = false;
					switch (parameter.key) {
						case "zMovePower":
							if (!move.hasOwnProperty("zMovePower") && !move.hasOwnProperty("isZ")) {
								found = operatorCompare[parameter.operator](1, 1) ? (parameter.value == 0) : (parameter.value != 0);
								break;
							}
							found = operatorCompare[parameter.operator](move.zMovePower, parameter.value);
							break;
						case "flags":
						case "zMoveBoost":
							if (!!move[parameter.key]) {
								found = multiValueChecker(parameter.operator, move[parameter.key], parameter.value);
								break;
							}
							//Key does not exist
							found = !operatorCompare[parameter.operator](1, 1);
							break;
						case "drain":
						case "isViable":
							found = operatorCompare[parameter.operator](!!move[parameter.key], (parameter.value == 'true' || parameter.value == true));
							break;
						case "learn":
							let pokemon = utils.parsePokemonName(parameter.value);
							if (pokemon === undefined) {
								found = false;
								break;
							}
							let canLearn = utils.learn(pokemon.species.toLowerCase().replace(/[^0-9a-z]/gi, ''), move.id);
							
							found = operatorCompare[parameter.operator](1, 1) ? (!!canLearn) : (!canLearn);
							break;
						case "secondaryChance":
							if (move.hasOwnProperty("secondary")) {
								found = operatorCompare[parameter.operator](move.secondary.chance, parameter.value);
								break;
							}
							if (move.hasOwnProperty("secondaries")) {
								for (let secondary in move.secondaries) {
									found = found || operatorCompare[parameter.operator](secondary.chance, parameter.value);
								}
								break;
							}
							found = operatorCompare[parameter.operator](1, 1) ? (parameter.value === 0) : (parameter.value != 0);
							break;
						case "boosts":
							if (move.hasOwnProperty("boosts")) {
								found = multiValueChecker(parameter.operator, move.boosts, parameter.value);
								break;
							}
							if (move.hasOwnProperty("self")) {
								if (move.self.hasOwnProperty("boosts")) {
									found = multiValueChecker(parameter.operator, move.self.boosts, parameter.value);
									break;
								}
							}
							if (move.hasOwnProperty("secondary")) {
								if (move.secondary.hasOwnProperty("self")) {
									if (move.secondary.self.hasOwnProperty("boosts")) {
										found = multiValueChecker(parameter.operator, move.secondary.self.boosts, parameter.value);
										break;
									}
								}
							}
							found = !operatorCompare[parameter.operator](1, 1);
							break;
						case "status":
						case "volatileStatus":
							if (move.hasOwnProperty(parameter.key)) {
								found = operatorCompare[parameter.operator](1, 1) ? (parameter.value === move[parameter.key]) : (parameter.value != move[parameter.key]);
								break;
							}
							if (move.hasOwnProperty("secondary")) {
								if (move.secondary.hasOwnProperty(parameter.key)) {
									found = operatorCompare[parameter.operator](1, 1) ? (parameter.value === move.secondary[parameter.key]) : (parameter.value != move[parameter.key]);
									break;
								}
							}
							if (move.hasOwnProperty("secondaries")) {
								for (let secondary in move.secondaries) {
									found = found || operatorCompare[parameter.operator](secondary[parameter.key], parameter.value);
								}
								break;
							}
							break;
						case "threshold":
							return;
						case "sort":
							return;
						default:
							break;
					}
					if (found) {
						fitParameter++;
					}
				}
			}
			//END "Iterate through all the parameters and see how many the moves matches"
			
			moveMatch[fitParameter].push(move.name);
			
		}
		//END "Iterate through all moves, then place them in buckets determined by how many parameters they satisfy"

		//Sort and print
		let pushStatement = "";
		if (threshholdObject === undefined){ 
			//Simply print out the list with the most matches
			for (let fitIndex = moveMatch.length - 1; fitIndex >= 0; fitIndex--) {
				if (moveMatch[fitIndex].length > 0 && fitIndex > 0) {
					//Sort
					for (let sortIndex = 0; sortIndex < sortParameters.length; sortIndex++) {
						let sorter = sortParameters[sortIndex];
						moveMatch[fitIndex].sort(function(aa, bb) {
							let a = moves[aa.toLowerCase().replace(/[^0-9a-z]/gi, '')];
							let b = moves[bb.toLowerCase().replace(/[^0-9a-z]/gi, '')];
							if (typeof a[sorter.value] === "number") { 
								//Numerical - Ascending (<)
								return b[sorter.value] - a[sorter.value];
							} else if (typeof a[sorter.value] === "string") {
								//String - Alphabetical (>)
								return a[sorter.value].localeCompare(b[sorter.value]);
							} else if (typeof a[sorter.value] === "boolean") {
								//Boolean - true first
								return (a[sorter.value] && !b[sorter.value]) ? 1 : 0;
							} else {
								//Refuse to sort anything else because I haven't gotten there yet
								//As far as I can tell this is just arrays and objects
								return 0;
							}
						});
					}
					if (fitIndex != moveMatch.length - 1) {
						pushStatement += "No move that satisfies ALL parameters found. ";
					}
					pushStatement += `List of moves that satisfy ${fitIndex} parameters:\n\n${moveMatch[fitIndex].join(", ")}`;
					break;
				}
			}
		} else {
			for (let fitIndex = 0; fitIndex < moveMatch.length; fitIndex++) {
				//This sublist is not in the threshhold--ignore it (or the length = 0)
				if (!operatorCompare[threshholdObject.operator](fitIndex, threshholdObject.value) || moveMatch[fitIndex].length === 0) {
					continue;
				}
				
				//Sort - shamefully copy-pasted
				for (let sortIndex = 0; sortIndex < sortParameters.length; sortIndex++) {
					let sorter = sortParameters[sortIndex];
					moveMatch[fitIndex].sort(function(a, b) {
						if (typeof a[sorter.value] === "number") { 
							//Numerical - Ascending (<)
							return b[sorter.value] - a[sorter.value];
						} else if (typeof a[sorter.value] === "string") {
							//String - Alphabetical (>)
							return a[sorter.value].localeCompare(b[sorter.value]);
						} else if (typeof a[sorter.value] === "boolean") {
							//Boolean - true first
							return (a[sorter.value] && !b[sorter.value]) ? 1 : 0;
						}  else {
							//Refuse to sort anything else because I haven't gotten there yet
							//As far as I can tell this is just arrays and objects
							return 0;
						}
					});
				}
				
				pushStatement += `List of moves that satisfy ${fitIndex} parameters:\n\n${moveMatch[fitIndex].join(", ")}\n\n`;				
			}
		}
		
		pushStatement = pushStatement.trim();
		if (pushStatement === "") {
			pushStatement = "No moves satisfy the search criteria";
		}
		
		sendMsg.push(pushStatement);
		utils.sendLongMessage(bot, msg, sendMsg.join(""));
	}
}





















