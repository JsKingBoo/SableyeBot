'use strict';

module.exports = {
	desc: "Sends the link to the PokemonShowdown's damage calculator.",
	usage: "",
	process: (bot, msg, suffix, flags) => {
		msg.channel.sendMessage("```Pokemon damage calculator:```\nhttps://pokemonshowdown.com/damagecalc/");
	}
}





