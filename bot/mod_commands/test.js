'use strict';

var fs = require('fs');

var config = require(`${__dirname}/../../config.json`);
var aliases = require(`${__dirname}/../aliases.json`);

//{ suffix: "", flags: {} }
var tests = {
	'commands': {
		'ability': [
			{ suffix: "magic bounce", flags: {} }, 
			{ suffix: "pwer OF ALCh34MY", flags: {} }
		],
		'about': [
			{ suffix: "", flags: {} }
		],
		'calculator': [
			{ suffix: "", flags: {} }
		],
		'coverage': [
			{ suffix: "normal, fire, fighting, steel", flags: {} }, 
			{ suffix: "pikachu", flags: {} }, 
			{ suffix: "sableye, fighting, fire", flags: {} }, 
			{ suffix: "water, grass, fire, electric, steel", flags: {} }
		],
		'data': [],
		'egg': [
			{ suffix: "water", flags: {} },
			{ suffix: "water2", flags: {} },
			{ suffix: "humanlike", flags: {} },
			{ suffix: "sableye", flags: {} },
			{ suffix: "fffff", flags: {} },
			{ suffix: "magnezone", flags: {} }
		],
		'event': [
			{ suffix: "tapu koko", flags: {} },
			{ suffix: ", 2", flags: {} },
			{ suffix: "pikachu, 4", flags: {} },
			{ suffix: "nidoking", flags: {} },
			{ suffix: "VENUSAUR", flags: {} }
		],
		'evolve': [
			{ suffix: "pikachu", flags: {} },
			{ suffix: "sableye", flags: {} },
			{ suffix: "clefable", flags: {} },
			{ suffix: "wurmple", flags: {} },
			{ suffix: "alolan marowak", flags: {} },
			{ suffix: "marowak-a", flags: {} }
		],
		'filter': [
			{ suffix: "heightm<=1,type=water,hasEvo=false", flags: {} },
			{ suffix: "ability=thick fat", flags: {} },
			{ suffix: " tier=OU, tier=BL, tier=UU, speed <=65, speed>=40, threshold=3", flags: {} },
			{ suffix: "move==rock wrecker", flags: {} },
			{ suffix: "move=Aurora veil, type!=ice", flags: {} },
			{ suffix: "type=grass, type=ground,type=flying", flags: {} },
			{ suffix: "move=Aurora veil", flags: {alola: true} }
		],
		'filterm': [
			{ suffix: "learn=whimsicott, learn!=sableye,category=status", flags: {} },
			{ suffix: "bp=90,type=electric", flags: {} },
			{ suffix: "bp=3", flags: {} },
			{ suffix: "bp<=60,type=bug,type=steel", flags: {} }
		],
		'hiddenpower': [
			{ suffix: "31,31,31,31,31,31", flags: {} }, 
			{ suffix: "fire", flags: {} }, 
			{ suffix: "fairy", flags: {} }, 
			{ suffix: "sableye", flags: {} },
			{ suffix: "31,30,31,30", flags: {} },
			{ suffix: "31,0,,31,31,31", flags: {} }
		],
		'item': [
			{ suffix: "leftovers", flags: {} }, 
			{ suffix: "figy berry", flags: {} }, 
			{ suffix: "custap berry", flags: {} }, 
			{ suffix: "fairumz", flags: {} },
			{ suffix: "souldew", flags: {} },
			{ suffix: "sableyenite", flags: {} },
			{ suffix: "mail", flags: {} }
		],
		'learn': [
			{ suffix: "swalot", flags: {} }, 
			{ suffix: "weavile, u-turn", flags: {} }, 
			{ suffix: "weavile, uturn", flags: {} }, 
			{ suffix: "hawlucha, bloom doom", flags: {} },
			{ suffix: "hawlucha, flying press", flags: {} },
			{ suffix: "venusaur, razor leaf", flags: {} },
			{ suffix: "gardevoir-mega", flags: {} }
		],
		'move': [
			{ suffix: "moonblast", flags: {} }, 
			{ suffix: "u-turn", flags: {} }, 
			{ suffix: "uturn", flags: {} }, 
			{ suffix: "bloom doom", flags: {} },
			{ suffix: "flying press", flags: {} },
			{ suffix: "quiver dnace", flags: {} }
		],
		'nature': [
			{ suffix: "bold", flags: {} }, 
			{ suffix: "serious", flags: {} }, 
			{ suffix: "spa, spa", flags: {} }, 
			{ suffix: "spd, spe", flags: {} }, 
			{ suffix: "atk,def", flags: {} }, 
		],
		'pokedex': [
			{ suffix: "kommo-o", flags: {} }, 
			{ suffix: "34", flags: {} }, 
			{ suffix: "alola marowak", flags: {} }, 
			{ suffix: "m sableye", flags: {} },
			{ suffix: "mega charizard x", flags: {} },
			{ suffix: "rotomw", flags: {} },
			{ suffix: "arceus-fairy", flags: {} }
		],
		'sprite': [
			{ suffix: "type: null", flags: {} },
			{ suffix: "kommo-o", flags: {back: true} },
			{ suffix: "mega sableye", flags: {shiny: true} },
			{ suffix: "primal groudon", flags: {back: true, shiny: true} },
			{ suffix: "mega charizard y", flags: {afd: true} },
		],
		'weakness': [
			{ suffix: "normal, fire, fighting, steel", flags: {} }, 
			{ suffix: "pikachu", flags: {} }, 
			{ suffix: "sableye, fighting, fire", flags: {} }, 
			{ suffix: "water, grass, fire, electric, steel", flags: {} }
		],
		'weightcoverage': [
			{ suffix: "normal, fire, fighting, steel", flags: {} }, 
			{ suffix: "pikachu", flags: {} }, 
			{ suffix: "sableye, fighting, fire", flags: {} }, 
			{ suffix: "water, grass, fire, electric, steel", flags: {} }
		]
	},
	'mod_commands': {
		'analyzeuser': [],
		'eval': [],
		'listservers': [],
		'save': [],
		'savedata': [],
		'setgame': [],
		'setstatus': [],
		'test': [],
		'updatedb': []
	}
}

tests.commands.data = tests.commands.data.concat(tests.commands.pokedex).concat(tests.commands.nature).concat(tests.commands.move).concat(tests.commands.ability).concat(tests.commands.item);

module.exports = {
	desc: "Unit test",
	usage: "[command name]",
	options: {mod: false, certain: false},
	process: (bot, msg, suffix, flags) => {
		
		let folder = 'commands';
		let dir = `${__dirname}/../../bot/`;
		if (flags.mod) {
			folder = 'mod_commands';
		}
		dir += folder;
		
		let name = suffix.toLowerCase().replace(/[^0-9a-z]/gi, '');
		if (tests[folder].hasOwnProperty(name)) {
			name += '.js';
			msg.channel.sendMessage("```" + `Testing ${name}` + "```");
		} else {
			msg.channel.sendMessage("```" + `Did not recognize command "${suffix}."` + "```");
			return;
		}
	
		if (!flags.certain) {
			msg.channel.sendMessage("```Testing stops SableyeBot temporarily! Use the 'certain' flag to confirm.```");
			return;
		}
		
		try {
			let testCommand = require(dir + "/" + name);
			msg.channel.sendMessage("```Loaded " + name + "```");
			let commandTests = tests[folder][name.slice(0, -3)]
			for (let i = 0; i < commandTests.length; i++){
				let testSuffix = commandTests[i].suffix.toLowerCase().replace(/[^0-9a-z,=<>!\-]/gi, "");
				
				let testFlags = Object.assign({}, testCommand.options || {});
				let flagstr = [];
				for (let flag in commandTests[i].flags) {
					if (testFlags.hasOwnProperty(flag)) {
						testFlags[flag] = commandTests[i].flags[flag];
						flagstr.push(flag);
					}
				}
				
				msg.channel.sendMessage("```" + `Test ${i} with suffix "${testSuffix}" and flags "${flagstr.join(',')}"` + "```");
				try {
					let result = testCommand.process(bot, msg, testSuffix, testFlags);
					if (result === "bad suffix") {
						msg.channel.sendMessage("```\"Bad suffix\" error returned.```");
					}
				} catch (err_test) {
					msg.channel.sendMessage("```" + `test.js error while performing tests: "${err_test}" during test ${i} of ${name}` + "```");
				}
			}
			msg.channel.sendMessage("```Done.```");
		} catch (err_parse) {
			msg.channel.sendMessage("```" + `test.js error while loading commands: "${err_parse}" while parsing ${name}` + "```");
		}
		
	}
}





