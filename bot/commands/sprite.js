'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);

module.exports = {
	desc: "Returns an image link to the specified Pokemon, or the sprite directory if no argument is given. This uses PokemonShowdown's sprite library.",
	usage: "[\"shiny\"] [Pokemon name]",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			msg.channel.sendMessage("```PokemonShowdown's sprite directory:```\nhttp://play.pokemonshowdown.com/sprites/");
		}
		let url = "http://play.pokemonshowdown.com/sprites/xyani/";
		let ending = ".gif";
		if (suffix.startsWith("shiny")) {
			url = "http://play.pokemonshowdown.com/sprites/xyani-shiny/";
			suffix = utils.fmt(suffix.substring(5));
		}
		let pokemon = utils.parsePokemonName(suffix)
		if (!pokemon) {
			msg.channel.sendMessage("```" + `Pokemon ${suffix} not found` + "```");
		}
		suffix = pokemon.species.toLowerCase().replace(/ /g, "");
		msg.channel.sendMessage(url + suffix + ending);
		
	}
}





