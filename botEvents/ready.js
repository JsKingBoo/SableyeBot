module.exports = (bot, config) => {
	bot.user.setAvatar(config.misc.avatar);
	bot.user.setGame(config.misc.playing_game);
}
