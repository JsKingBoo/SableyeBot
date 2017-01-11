//Quite possibly the most involved, and most useful, command that SableyeBot has to offer.

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

//Honestly expected to use this more often
let isBaseStat = (str) => {
	let stat = ["hp", "atk", "def", "spa", "spd", "spe"];
	return (stat.indexOf(str) >= 0);
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
			if (utils.fmt(multiValue[i]+"") === utils.fmt(value+"")) {
				return isEqual;
			}
		}
	} else if (multiValue.constructor === {}.constructor) {
		for (let i in multiValue) {
			if (utils.fmt(multiValue[i]+"") === utils.fmt(value+"")) {
				return isEqual;
			}
		}
	}
	return !isEqual;
};

module.exports = {
	desc: "Search Pokemon based on user-inputted parameters.",
	longDesc: `Search Pokemon based on user-inputted parameters. Availible parameters are:
num - Pokedex index number. e.g. "num=302",
species - Species name. e.g. "species=sableye",
baseSpecies - Base form, if applicable. e.g. "baseSpecies=rotom",
ability - Ability. e.g. "ability=prankster",
type - Pokemon typing. e.g. "type=ghost",
monotype - Pokemon typing, except it does not have a secondary typing. e.g. "monotype=ghost",
move - Move from learnset. Sketch is ignored. e.g. "move=will o wisp",
hp - Base HP stat. e.g. "hp=50",
atk - Base ATK stat. e.g. "atk=75",
def - Base DEF stat. e.g. "def=75",
spa - Base SPA stat. e.g. "spa=65",
spd - Base SPD stat. e.g. "spd=65",
spe - Base SPE stat. e.g. "spe=50",
bst - Base stat total. e.g. "bst=380",
prevo - Direct previous evolution. Unevolved Pokemon are ignored. e.g. "prevo=wurmple",
evos - Direct next possible evolutions. Pokemon that cannot evolve further are ignored. e.g. "evos=venusaur",
evoLevel - Minimum possible level of an evolved Pokemon. Unevolved Pokemon are ignored. e.g. "evoLevel=16",//genderRatio,
heightm - Height in meters. e.g. "heightm=0.5",
weightkg - Weight in kilograms. e.g. "weightkg=11",
color - Color. Options are red, blue, yellow, green, black, brown, purple, gray, white, and pink. e.g. "color=purple",
eggGroups - Egg group. e.g. "eggGroups=humanlike",
forme - Forme. Pokemon in their base forme are ignored. e.g. "forme=Mega",
formeLetter - Forme letter. Pokemon in their base formee are ignored. e.g. "formeLetter=m",
otherFormes - Other forms. Pokemon without other formes are ignored. e.g. "otherFormes=rotomwash",
threshold - Number of parameters that the Pokemon must fulfill, not including this one or "sort". e.g. "threshold>=2",
sort - The argument that the list will be sorted by in ascending order. e.g. "sort=atk",
EXAMPLE: "//filter hp=50,atk>=75,color=purple,formeLetter=m,eggGroups=humanlike"
NOTE: Some move and/or ability combinations are not compatible. Despite this, the Pokemon may still appear because they do satisfy the two or more requirements. For example, "//filter ability=unaware,move=softboiled" brings up Clefable even though Unaware Clefable cannot learn Soft-boiled.`,
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
			
			let customs = ["ability", "type", "monotype", "move", "hp", "atk", "def", "spa", "spd", "spe", "bst","evos","genderratio","egggroups","egggroup","baseforme","otherformes","threshold","threshhold","health","attack","defense","specialattack","specialdefense","speed", "basestattotal","sort"];
			if (customs.indexOf(parameterTemplate.key) >= 0) {
				parameterTemplate.hasCustomParsing = true;
			}
		
			if (parameterTemplate.hasCustomParsing) {
				//Note: some fall down
				switch (parameterTemplate.key) {
					case "health":
						parameterTemplate.key = "hp";
						break;
					case "attack":
						parameterTemplate.key = "atk";
						break;
					case "defense":
						parameterTemplate.key = "def";
						break;
					case "specialattack":
						parameterTemplate.key = "spa";
						break;
					case "specialdefense":
						parameterTemplate.key = "spd";
						break;
					case "speed":
						parameterTemplate.key = "spe";
						break;
					case "basestattotal":
						parameterTemplate.key = "bst";
						break;
					case "egggroups":
					case "egggroup":
						parameterTemplate.key = "eggGroups";
						break;
					case "otherformes": //NOTE: "otherforms" (without the e in forms) is NOT the same as "otherformes"
						parameterTemplate.key = "otherFromes";
						break;
					case "baseforme":
						parameterTemplate.key = "baseForme";
						parameter.hasCustomParsing = false;
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
				console.log("a");
				sendMsg.push(`[${(parameterIndex+1)}] Looking for Pokemon that satisfy ${threshholdObject.operator}${threshholdObject.value} argument(s).\n`);
			} else if (parameterTemplate.key === "sort") {
				parameterTemplate.operator = "=";
				sortParameters.push(parameterTemplate);
				sendMsg.push(`[${(parameterIndex+1)}] Sorting Pokemon by argument key ${parameterTemplate.value}.\n`);
			} else {
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
		
		//Iterate through all Pokemon, then place them in buckets determined by how many parameters they satisfy
		//Store species name rather than Pokemon object to lessen processing power
		let speciesMatch = [];
		for (let i = 0; i <= parameterList.length; i++) {
			speciesMatch.push([]);
		}
		
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
			
			let fitParameter = 0;
			
			//Iterate through all the parameters and see how many the Pokemon matches
			for (let parameterIndex = 0; parameterIndex < parameterList.length; parameterIndex++) {
				let parameter = parameterList[parameterIndex];
				if (!parameter.hasCustomParsing) {
					if (!pokemon.hasOwnProperty(parameter.key)) {
						continue;
					}
					let pokeProp = pokemon[parameter.key];
					if (typeof pokeProp === "number") {
						//pokeProp = parseInt(pokeProp);
						parameter.value = parseInt(parameter.value);
					} else {
						pokeProp = utils.fmt(pokeProp);
						//parameter.value = utils.fmt(parameter.value);
					}
					if (operatorCompare[parameter.operator](pokeProp, parameter.value)) {
						fitParameter++;
					}
				} else {
					//Note: some fall down
					let found = false;
					switch (parameter.key) {
						case "ability":
							found = multiValueChecker(parameter.operator, pokemon.abilities, parameter.value);
							break;
						case "type":
							found = multiValueChecker(parameter.operator, pokemon.types, parameter.value);
							break;
						case "monotype":
							found = operatorCompare[parameter.operator](pokemon.types.length, 1) && multiValueChecker(parameter.operator, pokemon.types, parameter.value);
							break;
						case "move":
							let move = parameter.value;
							if (!moves[move]) {
								found = false;
								break;
							}
							//Smeargle can learn every move except Chatter. XOR between move="chatter" and operator="="
							/* Comment out Smeargle case because we are now ignoring Sketch
							if (pokemon.species === "Smeargle" && ((move === "chatter") != operatorCompare[parameter.operator](1, 1))){
								found = true;
								break;
							}
							*/
							let infoArray = [];
							let moveRecurse = (mon) => {
								if (learnsets[mon] != undefined) {
									if (learnsets[mon].learnset.hasOwnProperty(move)){
										infoArray = infoArray.concat(learnsets[mon].learnset[move]);
									}
								}
								if (pokedex[mon].hasOwnProperty("baseSpecies")) {
									moveRecurse(utils.fmt(pokedex[mon].baseSpecies));
								}
								if (pokedex[mon].hasOwnProperty("prevo")){
									moveRecurse(pokedex[mon].prevo);
								}
							}
							moveRecurse(pokemonKey);
							let ii = 0;
							//Remove empty and invalid elements
							while (ii < infoArray.length){
								if (infoArray[ii] === undefined || (parseInt(infoArray[ii].charAt(0)) != 7 && flags.alola)){
									infoArray[ii] = infoArray[infoArray.length - 1];
									infoArray.pop();
								} else {
									ii++;
								}
							}
							found = operatorCompare[parameter.operator](1, 1) ? (infoArray.length > 0) : (infoArray.length === 0);
							break;	
							case "genderRatio":
								//Too difficult right now because of the whole M/F/N thing
								break;
							case "eggGroups":
							case "evos": 
							case "otherFormes":
								if (!pokemon.hasOwnProperty(parameter.key)) {
									found = false;
									break;
								}
								found = multiValueChecker(parameter.operator, pokemon[parameter.key], parameter.value);
								break;
							case "hp":
							case "atk":
							case "def":
							case "spa":
							case "spd":
							case "spe":
								found = operatorCompare[parameter.operator](pokemon.baseStats[parameter.key], parseInt(parameter.value));
								break;
							case "bst":
								found = operatorCompare[parameter.operator](pokemon.baseStats.hp + pokemon.baseStats.atk + pokemon.baseStats.def + pokemon.baseStats.spa + pokemon.baseStats.spd + pokemon.baseStats.spe, parseInt(parameter.value));
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
			//END "Iterate through all the parameters and see how many the Pokemon matches"
			
			speciesMatch[fitParameter].push(pokemon.species);
			
		}
		//END "Iterate through all Pokemon, then place them in buckets determined by how many parameters they satisfy"
		
		//Sort and print
		let pushStatement = "";
		if (threshholdObject === undefined){ 
			//Simply print out the list with the most matches
			for (let fitIndex = speciesMatch.length - 1; fitIndex >= 0; fitIndex--) {
				if (speciesMatch[fitIndex].length > 0 && fitIndex > 0) {
					//Sort
					for (let sortIndex = 0; sortIndex < sortParameters.length; sortIndex++) {
						let sorter = sortParameters[sortIndex];
						speciesMatch[fitIndex].sort(function(aa, bb) {
							let a = pokedex[utils.fmt(aa)];
							let b = pokedex[utils.fmt(bb)];
							//Numerical - Ascending (<)
							if (isBaseStat(sorter.value)){
								return b.baseStats[sorter.value] - a.baseStats[sorter.value];
							} else if (sorter.value === "bst") {
								return b.baseStats.hp + b.baseStats.atk + b.baseStats.def + b.baseStats.spa + b.baseStats.spd + b.baseStats.spe - a.baseStats.hp + a.baseStats.atk + a.baseStats.def + a.baseStats.spa + a.baseStats.spd + a.baseStats.spe;
							} else if (typeof a[sorter.value] === "number") { 
								return b[sorter.value] - a[sorter.value];
							} else if (typeof a[sorter.value] === "string") {
								//String - Alphabetical (>)
								return a[sorter.value].localeCompare(b[sorter.value]);
							} else {
								//Refuse to sort anything else because I haven't gotten there yet
								//As far as I can tell this is just arrays and objects
								return 0;
							}
						});
					}
					pushStatement = `List of Pokemon that satisfy ${fitIndex} parameters:\n\n${speciesMatch[fitIndex].join(", ")}`;
					break;
				}
			}
		} else {
			for (let fitIndex = 0; fitIndex < speciesMatch.length; fitIndex++) {
				//This sublist is not in the threshhold--ignore it (or the length = 0)
				console.log("b");
				if (!operatorCompare[threshholdObject.operator](fitIndex, threshholdObject.value) || speciesMatch[fitIndex].length === 0) {
					continue;
				}
				console.log("c");
				
				//Sort - shamefully copy-pasted
				for (let sortIndex = 0; sortIndex < sortParameters.length; sortIndex++) {
					let sorter = sortParameters[sortIndex];
					speciesMatch[fitIndex].sort(function(a, b) {
						//Numerical - Ascending (<)
						if (isBaseStat(sorter.value)){
							return b.baseStats[sorter.value] - a.baseStats[sorter.value];
						} else if (sorter.value === "bst") {
							return b.baseStats.hp + b.baseStats.atk + b.baseStats.def + b.baseStats.spa + b.baseStats.spd + b.baseStats.spe - a.baseStats.hp + a.baseStats.atk + a.baseStats.def + a.baseStats.spa + a.baseStats.spd + a.baseStats.spe;
						} else if (typeof a[sorter.value] === "number") { 
							return b[sorter.value] - a[sorter.value];
						} else if (typeof a[sorter.value] === "string") {
							//String - Alphabetical (>)
							return a[sorter.value].localeCompare(b[sorter.value]);
						} else {
							//Refuse to sort anything else because I haven't gotten there yet
							//As far as I can tell this is just arrays and objects
							return 0;
						}
					});
				}
				
				pushStatement += `List of Pokemon that satisfy ${fitIndex} parameters:\n\n${speciesMatch[fitIndex].join(", ")}\n\n`;				
			}
		}
		
		pushStatement = pushStatement.trim();
		if (pushStatement === "") {
			pushStatement = "No Pokemon satisfy the search criteria";
		}
		
		sendMsg.push(pushStatement);
		utils.sendLongMessage(bot, msg, sendMsg.join(""));
	}
}





















