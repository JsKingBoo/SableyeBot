'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);

module.exports = {
	desc: "Returns an image link to the specified Pokemon, or the sprite directory if no argument is given. This uses PokemonShowdown's sprite library.",
	usage: "[Pokemon name]",
	options: {shiny: false, back: false, female: false, afd: false},
	process: (bot, msg, suffix, flags) => {
		
		if (!suffix) {
			msg.channel.sendMessage("```PokemonShowdown's sprite directory:```\nhttp://play.pokemonshowdown.com/sprites/");
			return;
		}
		
		let pokemon = utils.parsePokemonName(suffix);
		if (!pokemon) {
			msg.channel.sendMessage('```' + `Pokemon ${suffix} not found` + '```');
			if (suffix.toLowerCase().startsWith('shiny')) {
				msg.channel.sendMessage('```Retrieving shiny sprites has been updated. You must now append the --shiny flag to your search. Other flag options are available.\ne.g. "sableye --shiny" "sableye --back" "sableye --shiny --back"```');
			}
			return;
		}
		
		//Base species + '-' + forme
		//Clean extranneous '-' (Due to Kommo-o)
		let name = ((pokemon.baseSpecies || pokemon.species).replace('-', '').trim() + (pokemon.forme != null ? '-' + pokemon.forme : '')).toLowerCase();
		
		let url = 'http://play.pokemonshowdown.com/sprites/';
		let dir = '';
		
		if (flags.back) {
			dir = '-back';
		}
		if (flags.shiny) {
			dir += '-shiny';
		}
		if (flags.afd) {
			dir = 'afd' + dir;
			msg.channel.sendMessage(url + dir + '/' + name + '.png');
			return;
		}
		
		dir = 'xyani' + dir;
		let path = url + dir + '/' + name;
		if (flags.female) {
			utils.checkUrlExists(path + '-f' + '.gif')
				.then((b) => {
					if (b) {
						msg.channel.sendMessage(path + '-f' + '.gif');
						return;
					} else {
						//:(
						msg.channel.sendMessage(path + '.gif');
					}
				});
		} else {
			msg.channel.sendMessage(path + '.gif');
		}
		
	}
}





