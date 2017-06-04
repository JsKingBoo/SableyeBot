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
		if (utils.parsePokemonName(pokemon) === undefined){
			msg.channel.sendMessage("```" + `Pokemon "${pokemon}" not recognized. Please check your spelling.` + "```");
			return;
		}
		pokemon = utils.parsePokemonName(pokemon).species.toLowerCase().replace(/[^0-9a-z]/gi, '');
		
		let move = suffix.split(",")[1];
		
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
						moveRecurse(pokedex[mon].baseSpecies.toLowerCase().replace(/[^0-9a-z]/gi, ''));
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
			let moveObj = utils.recognize(move, 'move');
			if (moveObj.score) {
				msg.channel.sendMessage("```" + `Move "${move}" not recognized. Please check your spelling.` + "```");
				return;
			}
			move = moveObj.id;
			
			let canLearn = utils.learn(pokemon, move);
			
			let sendMsg = [];
			if (!canLearn){
				msg.channel.sendMessage("```" + `${pokedex[pokemon].species} cannot learn ${moves[move].name}.` + "```");
				return;
			} else {
				sendMsg.push(`${pokedex[pokemon].species} can learn ${moves[move].name} from:\n`);
			}
			
			let methodName = {E:"egg", S:"event", D:"dream world", L:"level up", M:"TM/HM", T: "tutor", X:"egg, traded back", Y:"event, traded back", V:"VC transfer from gen1"};
			for (let gen in canLearn) {
				sendMsg.push(`Gen${gen}:`);
				for (let src in canLearn[gen]){
					let str = ` > ${src}: `;
					let methods = [];
					for (let method in canLearn[gen][src]) {
						let lvls = [];
						canLearn[gen][src][method].forEach((lvl) => {
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
						if (!methodName[method]) {
							methodName[method] = `Unknown method "${method}"`;
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






