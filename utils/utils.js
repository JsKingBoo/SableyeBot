'use strict';

//Dependencies or something
//none lul

//Essential files
var config = require(`${__dirname}/../config.json`)
var aliases = require(`${__dirname}/../bot/aliases.json`)

//Pokemon databases
var abilities = require(`${__dirname}/../data/abilities.js`)['BattleAbilities'];
var items = require(`${__dirname}/../data/items.js`)['BattleItems'];
var learnsets = require(`${__dirname}/../data/learnsets.js`)['BattleLearnsets'];
var moves = require(`${__dirname}/../data/moves.js`)['BattleMovedex'];
var natures = require(`${__dirname}/../data/natures.js`)['BattleNatures'];
var pokedex = require(`${__dirname}/../data/pokedex.js`)['BattlePokedex'];
var typechart = require(`${__dirname}/../data/typechart.js`)['BattleTypeChart'];
var formats_data = require(`${__dirname}/../data/formats-data.js`)['BattleFormatsData'];
var rulesets = require(`${__dirname}/../data/rulesets.js`)['BattleFormats'];

//dex
exports.alolaDex = {
				"Rowlet":1, "Dartrix":1, "Decidueye":1, "Litten":1, "Torracat":1, "Incineroar":1, "Popplio":1, "Brionne":1, "Primarina":1, "Pikipek":1, "Trumbeak":1, "Toucannon":1, "Yungoos":1, "Gumshoos":1, "Rattata-Alola":1, "Raticate-Alola":1, "Caterpie":1, "Metapod":1, "Butterfree":1, "Ledyba":1, "Ledian":1, "Spinarak":1, "Ariados":1, "Pichu":1, "Pikachu":1, "Raichu-Alola":1, "Grubbin":1, "Charjabug":1, "Vikavolt":1, "Bonsly":1, "Sudowoodo":1, "Happiny":1, "Chansey":1, "Blissey":1, "Munchlax":1, "Snorlax":1, "Slowpoke":1, "Slowbro":1, "Slowking":1, "Wingull":1, "Pelipper":1, "Abra":1, "Kadabra":1, "Alakazam":1, "Meowth-Alola":1, "Persian-Alola":1, "Magnemite":1, "Magneton":1, "Magnezone":1, "Grimer-Alola":1, "Muk-Alola":1, "Growlithe":1, "Arcanine":1, "Drowzee":1, "Hypno":1, "Makuhita":1, "Hariyama":1, "Smeargle":1, "Crabrawler":1, "Crabominable":1, "Gastly":1, "Haunter":1, "Gengar":1, "Drifloon":1, "Drifblim":1, "Misdreavus":1, "Mismagius":1, "Zubat":1, "Golbat":1, "Crobat":1, "Diglett-Alola":1, "Dugtrio-Alola":1, "Spearow":1, "Fearow":1, "Rufflet":1, "Braviary":1, "Vullaby":1, "Mandibuzz":1, "Mankey":1, "Primeape":1, "Delibird":1, "Oricorio":1, "Cutiefly":1, "Ribombee":1, "Petilil":1, "Lilligant":1, "Cottonee":1, "Whimsicott":1, "Psyduck":1, "Golduck":1, "Magikarp":1, "Gyarados":1, "Barboach":1, "Whiscash":1, "Machop":1, "Machoke":1, "Machamp":1, "Roggenrola":1, "Boldore":1, "Gigalith":1, "Carbink":1, "Sableye":1, "Rockruff":1, "Lycanroc":1, "Spinda":1, "Tentacool":1, "Tentacruel":1, "Finneon":1, "Lumineon":1, "Wishiwashi":1, "Luvdisc":1, "Corsola":1, "Mareanie":1, "Toxapex":1, "Shellder":1, "Cloyster":1, "Bagon":1, "Shelgon":1, "Salamence":1, "Lillipup":1, "Herdier":1, "Stoutland":1, "Eevee":1, "Vaporeon":1, "Jolteon":1, "Flareon":1, "Espeon":1, "Umbreon":1, "Leafeon":1, "Glaceon":1, "Sylveon":1, "Mudbray":1, "Mudsdale":1, "Igglybuff":1, "Jigglypuff":1, "Wigglytuff":1, "Tauros":1, "Miltank":1, "Surskit":1, "Masquerain":1, "Dewpider":1, "Araquanid":1, "Fomantis":1, "Lurantis":1, "Morelull":1, "Shiinotic":1, "Paras":1, "Parasect":1, "Poliwag":1, "Poliwhirl":1, "Poliwrath":1, "Politoed":1, "Goldeen":1, "Seaking":1, "Feebas":1, "Milotic":1, "Alomomola":1, "Fletchling":1, "Fletchinder":1, "Talonflame":1, "Salandit":1, "Salazzle":1, "Cubone":1, "Marowak-Alola":1, "Kangaskhan":1, "Magby":1, "Magmar":1, "Magmortar":1, "Stufful":1, "Bewear":1, "Bounsweet":1, "Steenee":1, "Tsareena":1, "Comfey":1, "Pinsir":1, "Oranguru":1, "Passimian":1, "Goomy":1, "Sliggoo":1, "Goodra":1, "Castform":1, "Wimpod":1, "Golisopod":1, "Staryu":1, "Starmie":1, "Sandygast":1, "Palossand":1, "Cranidos":1, "Rampardos":1, "Shieldon":1, "Bastiodon":1, "Archen":1, "Archeops":1, "Tirtouga":1, "Carracosta":1, "Phantump":1, "Trevenant":1, "Nosepass":1, "Probopass":1, "Pyukumuku":1, "Chinchou":1, "Lanturn":1, "Type: Null":1, "Silvally":1, "Zygarde":1, "Trubbish":1, "Garbodor":1, "Skarmory":1, "Ditto":1, "Cleffa":1, "Clefairy":1, "Clefable":1, "Minior":1, "Beldum":1, "Metang":1, "Metagross":1, "Porygon":1, "Porygon2":1, "Porygon-Z":1, "Pancham":1, "Pangoro":1, "Komala":1, "Torkoal":1, "Turtonator":1, "Togedemaru":1, "Elekid":1, "Electabuzz":1, "Electivire":1, "Geodude-Alola":1, "Graveler-Alola":1, "Golem-Alola":1, "Sandile":1, "Krokorok":1, "Krookodile":1, "Trapinch":1, "Vibrava":1, "Flygon":1, "Gible":1, "Gabite":1, "Garchomp":1, "Klefki":1, "Mimikyu":1, "Bruxish":1, "Drampa":1, "Absol":1, "Snorunt":1, "Glalie":1, "Froslass":1, "Sneasel":1, "Weavile":1, "Sandshrew-Alola":1, "Sandslash-Alola":1, "Vulpix-Alola":1, "Ninetales-Alola":1, "Vanillite":1, "Vanillish":1, "Vanilluxe":1, "Snubbull":1, "Granbull":1, "Shellos":1, "Gastrodon":1, "Relicanth":1, "Dhelmise":1, "Carvanha":1, "Sharpedo":1, "Wailmer":1, "Wailord":1, "Lapras":1, "Exeggcute":1, "Exeggutor-Alola":1, "Jangmo-o":1, "Hakamo-o":1, "Kommo-o":1, "Emolga":1, "Scyther":1, "Scizor":1, "Murkrow":1, "Honchkrow":1, "Riolu":1, "Lucario":1, "Dratini":1, "Dragonair":1, "Dragonite":1, "Aerodactyl":1, "Tapu Koko":1, "Tapu Lele":1, "Tapu Bulu":1, "Tapu Fini":1, "Cosmog":1, "Cosmoem":1, "Solgaleo":1, "Lunala":1, "Nihilego":1, "Buzzwole":1, "Pheromosa":1, "Xurkitree":1, "Celesteela":1, "Kartana":1, "Guzzlord":1, "Necrozma":1, "Magearna":1, "Marshadow":1,
};
/**
* Levenshtein distance between two strings. Algorithm by Milot-Mirdita
* @arg {String} 		a 					String.
* @arg {String} 		b 					String.
* @returns {Integer} 		 				Levenshtein distance between a and b.
*/
var levenshtein = function(a, b) {
	if (a.length == 0) { return b.length; } 
	if (b.length == 0) { return a.length; }
	
	// swap to save some memory O(min(a,b)) instead of O(a)
	if(a.length > b.length) {
		let tmp = a;
		a = b;
		b = tmp;
	}
	
	let row = [];
	for(let i = 0; i <= a.length; i++) {
		row[i] = i;
	}
	
	for (let i = 1; i <= b.length; i++) {
		let prev = i;
		for (let j = 1; j <= a.length; j++) {
			let val;
			if (b.charAt(i-1) == a.charAt(j-1)) {
				val = row[j-1]; // match
			} else {
				val = Math.min(row[j-1] + 1, // substitution
						prev + 1,     // insertion
						row[j] + 1);  // deletion
			}
			row[j - 1] = prev;
			prev = val;
		}
		row[a.length] = prev;
	}
	return row[a.length];
}	

/**
* Function that ensures that strings only contain alphanumeric characters or commas.
* @arg {String} 		str 				String to be formatted.
* @returns {String} 		 				Formatted string.
*/
exports.fmt = (str) => {
	return str.trim().toLowerCase().replace(/[^0-9a-z,=<>!\-]/gi, '');
}

/**
* Helper command to split long messages into one or several DM/PMs
* @arg {Client} 		bot 				The client.
* @arg {Message} 		msg 				The message that triggered the command.
* @arg {String} 		outputStr 			The message to send to the user.
* @arg {boolean} 		forcePM 			If true, sends the message through PM/DM regardless of message length.
* @arg {String} 		splitChar 			The preferred character to split the output string by. So your message doesn't cut a word or sentence in half.
*/
exports.sendLongMessage = (bot, msg, outputStr, forcePM = false, splitChar = ",") => { //note to self: clean this up later
	if (outputStr.length >= config.message.force_pm || forcePM) {
		if (msg.guild) {
			msg.channel.sendMessage(`${msg.author}, sent response via PM.`);
		}
		
		var timeoutWrapper = (strarr, ind) => {
			if (ind < strarr.length) {
				setTimeout(() => {
					msg.author.sendMessage("```" + strarr[ind] + "```")
					timeoutWrapper(strarr, ind+1);
				}, 1000);
			}
		};
		
		let splitter = splitChar || ",";
		let sendMsgHelper = outputStr.split(splitter);
		let sendMsgFinal = [[]];
		let ci = 0;
		let lengthHelper = 0;
		for (let i = 0; i < sendMsgHelper.length; i++){
			if (lengthHelper < config.message.max_message_length){
				lengthHelper += sendMsgHelper[i].length + splitter.length;
				sendMsgFinal[ci].push(sendMsgHelper[i]);
			} else {
				sendMsgFinal.push([]);
				ci++;
				lengthHelper = 0;
			}
		}
		for (let i = 0; i < sendMsgFinal.length; i++){
			sendMsgFinal[i] = sendMsgFinal[i].join(splitter);
		}
		timeoutWrapper(sendMsgFinal, 0);
	} else {
		msg.channel.sendMessage("```" + outputStr + "```");
	}
}

/**
* Parses a Pokemon's name
* @arg {String} 		input 				User input.
* @returns {Object}							Pokemon object, or null if no match found.
*/
var parsePokemonName = (input) => {
	let pokemon = pokedex[input];
	if (pokemon === undefined){
		let validPrefix = ["Mega", "Primal"];
		let movePrefix = (str) => { //str is unformatted species name
			let returnValue = str;
			validPrefix.forEach((forme) => {
				if (str.indexOf(forme) < 0){
					return;
				}		
				returnValue = forme + str.substring(0, str.indexOf(forme)) + str.substring(str.indexOf(forme) + forme.length, str.length);
			});	
			return returnValue.trim().toLowerCase().replace(/[^0-9a-z]/gi, '');
		};
		
		let formeLetter = (str) => { //str is unformatted species name
			let returnValue = str;
			if (pokedex[str].hasOwnProperty("formeLetter")) {
				returnValue = pokedex[str].baseSpecies + pokedex[str].formeLetter;
			}
			return returnValue.trim().toLowerCase();
		};
		
		let formeType = (str) => { //str is unformatted species name
			let returnValue = str;
			if (pokedex[str].hasOwnProperty("baseForme")) {
				returnValue = pokedex[str].species + pokedex[str].baseForme;
			} else if (pokedex[str].hasOwnProperty("forme")) {
				returnValue = pokedex[str].species + pokedex[str].forme;
			}
			return returnValue.trim().toLowerCase();
		};
		
		for (let mon in pokedex) {
			if (!pokedex.hasOwnProperty(mon)) {
				continue;
			}
			if ((pokedex[mon].num === parseInt(input) && !pokedex[mon].hasOwnProperty("baseSpecies")) || (movePrefix(pokedex[mon].species) === input) || (formeLetter(mon) === input) || (formeType(mon) === input)){
				pokemon = pokedex[mon];
				break;
			}
		}
	}
	return pokemon;
}
exports.parsePokemonName = parsePokemonName;

/**
* Guesses what a mispelled inquery might be
* @arg {String} 		item 				User input.
* @arg {String} 		forceType 			Force a recognization of a certain type. Types are "pokemon", "ability", "move", and "item".
* @returns {Array}							An array that holds the best match name, the score of the best match, and the type of the best match.
*/
exports.recognize = (item, forceType) => {
	//if forceType is not defined, always return true
	let forceTypeCheck = (type) => { return (!forceType || type === forceType); }
	
	if (parsePokemonName(item) && forceTypeCheck("pokemon")){
		return [parsePokemonName(item).species.toLowerCase(), 0, "pokemon"];
	}
	
	//iterate through our databases and get a best fit
	let bestItem = null;
	let bestScore = 99999; //arbitrary large number lol
	let bestType = null;
		
	["pokemon", "move", "ability", "item"].forEach((typing, ind) => {
		if (forceTypeCheck(typing)) {
			let db = [pokedex, moves, abilities, items];
			Object.keys(db[ind]).forEach((key) => {
				if (levenshtein(item, key) < bestScore) {
					bestItem = key;
					bestScore = levenshtein(item, key);
					bestType = typing;
				}
			});
		}	
	});
	
	return [bestItem, bestScore, bestType];
}






