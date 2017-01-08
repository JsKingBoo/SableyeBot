'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var abilities = require(`${__dirname}/../../data/abilities.js`)['BattleAbilities'];

module.exports = {
	desc: "Gives brief information on the effects of an ability.",
	longDesc: `Gives information on the effects of an ability and rates it. The rating scale goes from -2 to 5 and is based on its usefullness in a singles battle. 

-2: Extremely detrimental
The sort of ability that relegates Pokemon with Uber-level BSTs into NU. ex. Slow Start, Truant
-1: Detrimental
An ability that does more harm than good. ex. Defeatist, Normalize
0: Useless
An ability with no net effect during a singles battle. ex. Healer, Illuminate
1: Ineffective
An ability that has a minimal effect. Should not be chosen over any other ability. ex. Damp, Shell Armor
2: Situationally useful
An ability that can be useful in certain situations. ex. Blaze, Insomnia
3: Useful
An ability that is generally useful. ex. Infiltrator, Sturdy
4: Very useful
One of the most popular abilities. The difference between 3 and 4 can be ambiguous. ex. Protean, Regenerator
5: Essential
The sort of ability that defines metagames. ex. Desolate Land, Shadow Tag`,
	usage: "<ability name>",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		
		let ability = abilities[suffix];
		if (ability === undefined){
			let helper = utils.recognize(suffix, "ability");
			msg.channel.sendMessage("```" + `Ability "${suffix}" not recognized. Did you mean "${helper[0]}"?` + "```");
			ability = abilities[helper[0]];
			return;
		}
		
		let sendMsg = `**${ability.name}**
${(ability.desc || ability.shortDesc)}
 > Rating: ${ability.rating}`

		msg.channel.sendMessage("```" + sendMsg + "```");	
		
	}
}