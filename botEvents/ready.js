module.exports = (bot, config) => {
	bot.user.setAvatar(config.misc.avatar);
	if (bot.user.presence.game) {
		if (!bot.user.presence.game.name) {
			bot.user.setGame(config.misc.playing_game);
		}
	}
}
