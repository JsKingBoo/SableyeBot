'use strict';

var utils = require(`${__dirname}/../../utils/utils.js`);
var moves = require(`${__dirname}/../../data/moves.js`)['BattleMovedex'];
var items = require(`${__dirname}/../../data/items.js`)['BattleItems'];

var moveGen = (num) => {
	if (num <= 0) { return -1; }
	if (num <= 165) { return 1; }
	if (num <= 251) { return 2; }
	if (num <= 354) { return 3; }
	if (num <= 467) { return 4; }
	if (num <= 559) { return 5; }
	if (num <= 621) { return 6; }
	if (num <= 719) { return 7; }
	return 8; 
};
			
module.exports = {
	desc: "Gives brief information on a move.",
	longDesc: "Gives the type, category, power, Z-crystal effects, accuracy, PP, description, priority, target, generation, viability, contest type, and ability interactions of a move. An accuracy of 'true' means that the move does not perform an accuracy check.",
	usage: "<move name>",
	process: (bot, msg, suffix, flags) => {
		if (!suffix){
			return "bad suffix";
		}
		let move = moves[suffix];
		
		if (move === undefined){
			let helper = utils.recognize(suffix, "move");
			msg.channel.sendMessage("```" + `Move "${suffix}" not recognized. Did you mean "${helper[0]}"?` + "```");
			move = moves[helper[0]];
		}

		
		let sendMsg = `**${move.name}**
${move.type}; ${move.category}
`
		//Z move parsing
		let zstring = ""; //LOL
		if (move.isZ) {
			zstring = `(${items[move.isZ].name})`;
		} else if (move.zMoveEffect) {
			zstring = `(Z: ${move.zMoveEffect})`;
		} else if (move.zMoveBoost) {
			zstring = "(Z: ";
			let za = [];
			Object.keys(move.zMoveBoost).forEach((key) => {
				za.push(key.toUpperCase() + "+" + move.zMoveBoost[key]);
			});
			zstring += za.join(",") + ")";
		} else {
			zstring = `(Z: ${move.zMovePower})`;
		}
			
		sendMsg += `Power: ${move.basePower} ${zstring}; Accuracy: ${move.accuracy}; PP: ${move.pp} (max ${Math.floor(move.pp * 1.6)})
${((move.desc || move.shortDesc) || "No description availible.")}
~~
Priority: ${move.priority}
Target: ${move.target}
Introduced in: gen${moveGen(move.num)}
Viable: ${(move.isViable || "false")}
Contest: ${move.contestType}
`
			
		if (move.flags.hasOwnProperty('bullet')){
			sendMsg += "Has no effect on Pokemon with the Ability Bulletproof. ";
		}
		if (move.flags.hasOwnProperty('protect')){
			sendMsg += "Blocked by Detect, Protect, Spiky Shield, and if not a Status move, King's Shield. ";
		}
		if (move.flags.hasOwnProperty('mirror')){
			sendMsg += "Can be copied by Mirror Move. ";
		}
		if (move.flags.hasOwnProperty('authentic')){
			sendMsg += "Ignores a target's substitute. ";
		}
		if (move.flags.hasOwnProperty('bite')){
			sendMsg += "Power is multiplied by 1.5 when used by a Pokemon with the Ability Strong Jaw. ";
		}
		if (move.flags.hasOwnProperty('charge')){
			sendMsg += "The user is unable to make a move between turns. ";
		}
		if (move.flags.hasOwnProperty('contact')){
			sendMsg += "Makes contact. ";
		}
		if (move.flags.hasOwnProperty('dance')){
			sendMsg += "Can be copied by the ability Dancer. ";
		}
		if (move.flags.hasOwnProperty('defrost')){
			sendMsg += "Thaws the user if executed successfully while the user is frozen. ";
		}
		if (move.flags.hasOwnProperty('distance')){
			sendMsg += "Can target a Pokemon positioned anywhere in a Triple Battle. ";
		}
		if (move.flags.hasOwnProperty('gravity')){
			sendMsg += "Prevented from being executed or selected during Gravity's effect. ";
		}
		if (move.flags.hasOwnProperty('heal')){
			sendMsg += "Prevented from being executed or selected during Heal Block's effect. ";
		}
		if (move.flags.hasOwnProperty('nonsky')){
			sendMsg += "Prevented from being executed or selected in a Sky Battle. ";
		}
		if (move.flags.hasOwnProperty('powder')){
			sendMsg += "Has no effect on Grass-type Pokemon, Pokemon with the Ability Overcoat, and Pokemon holding Safety Goggles. ";
		}
		if (move.flags.hasOwnProperty('pulse')){
			sendMsg += "Power is multiplied by 1.5 when used by a Pokemon with the Ability Mega Launcher. ";
		}
		if (move.flags.hasOwnProperty('punch')){
			sendMsg += "Power is multiplied by 1.2 when used by a Pokemon with the Ability Iron Fist. ";
		}
		if (move.flags.hasOwnProperty('recharge')){
			sendMsg += "If this move is successful, the user must recharge on the following turn and cannot make a move. ";
		}
		if (move.flags.hasOwnProperty('reflectable')){
			sendMsg += "Bounced back to the original user by Magic Coat or the Ability Magic Bounce. ";
		}
		if (move.flags.hasOwnProperty('snatch')){
			sendMsg += "Can be stolen from the original user and instead used by another Pokemon using Snatch. ";
		}
		if (move.flags.hasOwnProperty('sound')){
			sendMsg += "Has no effect on Pokemon with the Ability Soundproof. ";
		}
		msg.channel.sendMessage("```" + sendMsg + "```");
		
	}
}


