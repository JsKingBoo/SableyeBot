'use strict';

var pack = require(`${__dirname}/../../package.json`);

module.exports = {
	desc: "About SableyeBot.",
	usage: "",
	process: (bot, msg, suffix, flags) => {
		msg.channel.sendEmbed({
			title: "About SableyeBot",
			description: "Competitive Pokemon Discord bot.",
			author: {
				name: "JsKingBoo#8858",
				icon_url: "http://i.imgur.com/HYJS7kn.png"
			},
			color: 6238891,
			fields: [
				{name: "Language", value: "JavaScript (discordjs)"}
			],
			footer: {
				text: `SableyeBot version ${pack.version}`
			}
		});
	}
}





