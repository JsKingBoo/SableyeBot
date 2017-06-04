'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var pokedex = require(`${__dirname}/../../data/pokedex.js`)['BattlePokedex'];
var items = require(`${__dirname}/../../data/items.js`)['BattleItems'];
var moves = require(`${__dirname}/../../data/moves.js`)['BattleMovedex'];
var formats_data = require(`${__dirname}/../../data/formats-data.js`)['BattleFormatsData'];

module.exports = {
	desc: "Returns the number of events a Pokemon has or the set details of a specific event.",
	longDesc: "Returns event information of a Pokemon. If no event ID is specified, then the number of events that a Pokemon has is listed, if it has been included in an event. If an event ID is apecified, information regarding the Pokemon distributed during the event is retrieved. Event ID index starts at 0.",
	usage: "<Pokemon name>, [event ID]",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
				
		let getSet = suffix.split(",");
		let pokemon = utils.parsePokemonName(getSet[0]);
		if (pokemon === undefined){
			msg.channel.sendMessage("```" + `Pokemon "${suffix}" not recognized. Please check your spelling.` + "```");
			return;
		}
		let pokemonDisplay = pokemon.species;
		pokemon = pokemonDisplay.toLowerCase().replace(/[^0-9a-z]/gi, '');
		if (getSet.length === 1){
			if (!formats_data[pokemon].eventPokemon) {
				msg.channel.sendMessage("```" + `${pokemonDisplay} does not have any events.` + "```");
				return;
			} else if (formats_data[pokemon].eventPokemon.length === 1) {
				getSet.push(0);
				getSet[1] = 0;
			} else {
				msg.channel.sendMessage("```" + `${pokemonDisplay} has ${formats_data[pokemon].eventPokemon.length} event(s). (0-${(formats_data[pokemon].eventPokemon.length-1)})` + "```");
				return;
			}
		}
		let eventId = parseInt(getSet[1]);
		if (!formats_data[pokemon].eventPokemon) {
			msg.channel.sendMessage("```" + `${pokemonDisplay} does not have any events.` + "```");
			return;
		} else if (formats_data[pokemon].eventPokemon.length-1 < eventId) {
			msg.channel.sendMessage("```" + `${pokemonDisplay} does not have that many events (max ${(formats_data[pokemon].eventPokemon.length-1)})` + "```");
			return;
		} else {
			let eventData = formats_data[pokemon].eventPokemon[eventId];
			let sendMsg = [];
			sendMsg.push(`${pokemonDisplay} (${eventId})`);
			sendMsg.push(`Gen: ${eventData.generation}`);
			sendMsg.push(`Level: ${eventData.level}`);
			let ball = items[eventData.pokeball];
			if (ball) {
				ball = ball.name;
			}
			sendMsg.push(`Ball: ${(ball || "-")}`);
			sendMsg.push(`Gender: ${(eventData.gender || "-")}`);
			sendMsg.push(`Nature: ${(eventData.nature || "-")}`);
			sendMsg.push(`Hidden ability: ${(eventData.isHidden || "false")}`);
			sendMsg.push(`Shiny: ${((eventData.shiny > 0 || eventData.shiny === true) || "false")}`);
			//IVs
			if (eventData.ivs != undefined) {
				let IV = [];
				for (let ivdata in eventData.ivs) {
					IV.push(`${ivdata}:${eventData.ivs[ivdata]}`);
				}
				sendMsg.push(`IVs: ${IV.join(", ")}`);
			}
			if (eventData.perfectIVs != undefined) {
				sendMsg.push(`Number of perfect IVs: ${eventData.perfectIVs}`);
			}
			//moves
			sendMsg.push("Moves:");
			eventData.moves.forEach((move) => {
				sendMsg.push(` - ${moves[move].name}`);
			});
			utils.sendLongMessage(bot, msg, sendMsg.join("\n"));
			
		}
		
		
		
	}
}





