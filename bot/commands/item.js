'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var items = require(`${__dirname}/../../data/items.js`)['BattleItems'];

module.exports = {
	desc: "Gives brief information on an item.",
	longDesc: "Gives a description of an item's effects and the generation it was introduced in. If applicable, the fling power and fling status effect is given. If applicable, the base power of the move Natural Gift and its type is given.",
	usage: "<item name>",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		} 
		
		let item = items[suffix];
		
		if (item === undefined){
			let helper = utils.recognize(suffix, 'item');
			msg.channel.sendMessage("```" + `Item "${suffix}" not recognized. Did you mean "${helper.item.name}"?` + "```");
			item = helper.item;
		}
		
		let sendMsg = `**${item.name}**`
		if (item.hasOwnProperty("naturalGift")){
			sendMsg += `\nNatural Gift: BP: ${(item.naturalGift.basePower || "-")}; Type: ${(item.naturalGift.type || "-")}`;
		}
		if (item.hasOwnProperty("fling")){
			sendMsg += `\nFling power: ${(item.fling.basePower || "-")} ${((item.fling.status || item.fling.volatileStatus) || "-")}`;
		}
		sendMsg += `\nIntroduced in gen${(item.gen || "-")}`;

		sendMsg += `\n${item.desc || "No description availible."}`;
		msg.channel.sendMessage("```" + sendMsg + "```");
		
	}
}






