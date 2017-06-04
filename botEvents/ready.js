module.exports = (bot, config) => {
	if (!bot.user.presence.game.name) {
		bot.user.setAvatar(config.misc.avatar);
		bot.user.setGame(config.misc.playing_game);
	}
}
