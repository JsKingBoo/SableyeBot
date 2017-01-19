'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var moves = require(`${__dirname}/../../data/moves.js`)['BattleMovedex'];
var learnsets = require(`${__dirname}/../../data/learnsets.js`)['BattleLearnsets'];

module.exports = {
	desc: "Gives whether a Pokemon can learn a move or a Pokemon's learnset.",
	longDesc: "Gives the Pokemon's learnset, or the methods which a Pokemon can learn a move if a move is given. Moves learned through Sketch are ignored. If a move is specified, additional information is given, such as the generation that the Pokemon can learn the move and the sources of where it can learn it. There are three sources: direct, baseSpecies, and prevo. `direct` indicates that the Pokemon can learn the move directly. `baseSpecies` indicates that the Pokemon must first learn the move in its base forme. `prevo` indicates that the move is only availible prior to its current evolution stage. If a Pokemon can learn a move by level up, the levels are given. If a Pokemon can learn a move through an event, then the event number is given. Moves learned by Sketch are ignored.",
	usage: "<Pokemon name>, [move name]",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		let pokemon = suffix.split(",")[0];

		let move = suffix.split(",")[1];
		if (utils.parsePokemonName(pokemon) === undefined){
			msg.channel.sendMessage("```" + `Pokemon "${pokemon}" not recognized. Please check your spelling.` + "```");
			return;
		}
		pokemon = utils.fmt(utils.parsePokemonName(pokemon).species);
		
		if (!move) { //spit out learnset
			//move to base species and previous			
			let originalPokemon = pokemon
			let infoArray = [];
			let sendMsg = [];
			let moveRecurse = (mon) => {
				if (learnsets.hasOwnProperty(mon)) {
					infoArray = infoArray.concat(learnsets[mon].learnset);
				}
				if (pokedex[mon].hasOwnProperty("baseSpecies")) {
					if (pokedex[mon].forme != "Alola") {
						moveRecurse(utils.fmt(pokedex[mon].baseSpecies));
					}
				}
				if (pokedex[mon].hasOwnProperty("prevo")){
					moveRecurse(pokedex[mon].prevo);
				}
			}
			moveRecurse(pokemon);
			pokemon = originalPokemon;
			
			//clean up empty lists
			let ii = 0;
			while (ii < infoArray.length){
				if (infoArray[ii] === undefined){
					infoArray[ii] = infoArray[infoArray.length - 1];
					infoArray.pop();
				} else {
					ii++;
				}
			}
			
			//go through infoArray and add everything to the list of moves
			let listOfMoves = [];
			infoArray.forEach((learnsetList) => {
				Object.keys(learnsetList).forEach((moveId) => {
					let moveName = moves[moveId].name;
					if (!listOfMoves.includes(moveName)) {
						listOfMoves.push(moveName);
					}
				});
			});
			listOfMoves.sort();
			
			sendMsg.push("Learnset of " + pokedex[pokemon].species + ":");
			sendMsg.push(listOfMoves.join(", "));
			if (listOfMoves.includes("Sketch")) {
				sendMsg.push("Note: This Pokemon can learn Sketch, allowing it to learn almost every move.");
			}
			
			utils.sendLongMessage(bot, msg, sendMsg.join("\n"));
		} else { //how does pokemon learn this move
			if (moves[move] === undefined) {
				msg.channel.sendMessage("```" + `Move "${move}" not recognized. Please check your spelling.` + "```");
				return;
			}
			let empty = true;
			let originalPokemon = pokemon;
			let sourcesObj = {};
			let methodName = {E:"egg", S:"event", D:"dream world", L:"level up", M:"TM/HM", T: "tutor", X:"egg, traded back", Y:"event, traded back"};
			let moveRecurse = (mon, src) => {
				if (learnsets[mon] != undefined) {
					if (learnsets[mon].learnset.hasOwnProperty(move)){
						learnsets[mon].learnset[move].forEach((moveData) => {
							/*
							How to create really complicated data structures
							The move learn source is sorted in a tree by generation, source, then method
							Sources are currently "direct", "baseSpecies", and "prevo"
							*/
							empty = false;							
							let gen = moveData.charAt(0);
							let method = moveData.charAt(1);
							let lvl = -1;
							if (method === 'S' || method === 'L') {
								lvl = moveData.substring(2);
							}
							
							if (!sourcesObj.hasOwnProperty(gen)) {
								sourcesObj[gen] = {};
							}
							if (!sourcesObj[gen].hasOwnProperty(src)) {
								sourcesObj[gen][src] = {};
							}
							if (!sourcesObj[gen][src].hasOwnProperty(method)) {
								sourcesObj[gen][src][method] = [];
							}
							sourcesObj[gen][src][method].push(lvl);
						});
					}
				}
				if (pokedex[mon].hasOwnProperty("baseSpecies")) {
					//As far as I know, Alolan formes are the only type of formes that do not share movepools.
					if (pokedex[mon].forme != "Alola") {
						moveRecurse(utils.fmt(pokedex[mon].baseSpecies), "baseSpecies");
					}
				}
				if (pokedex[mon].hasOwnProperty("prevo")){
					moveRecurse(pokedex[mon].prevo, "prevo");
				}
			}
			moveRecurse(pokemon, "direct");
			pokemon = originalPokemon;
			
			let sendMsg = [];
			if (empty){
				msg.channel.sendMessage("```" + `${pokedex[pokemon].species} cannot learn ${moves[move].name}.` + "```");
				return;
			} else {
				sendMsg.push(`${pokedex[pokemon].species} can learn ${moves[move].name} from:\n`);
			}
			
			for (let gen in sourcesObj) {
				sendMsg.push(`Gen${gen}:`);
				for (let src in sourcesObj[gen]){
					let str = ` > ${src}: `;
					let methods = [];
					for (let method in sourcesObj[gen][src]) {
						let lvls = [];
						sourcesObj[gen][src][method].forEach((lvl) => {
							if (lvl >= 0) {
								lvls.push(lvl);
							}
						});
						if (lvls.length === 0) {
							lvls = "";
						} else {
							lvls.sort((a, b) => { return a - b; })
							lvls = ` (${lvls.join(",")})`;
						}
						methods.push(`${methodName[method]}${lvls}`);
					}
					str += methods.join("; ");
					sendMsg.push(str);
				}
			}
			msg.channel.sendMessage("```" + `${sendMsg.join("\n")}` + "```");
			
		}
	}
}






