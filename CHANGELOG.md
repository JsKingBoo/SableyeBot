###2.6.0 - 2017-03-14
 * Add `weightcoverage` command
 * Add `filterm` command
 * Add evolution and prevolution checking to `filter` command
 * Fix `filter` command hanging when user inputs multiple threshold arguments
 * Fix `eval` mod command outputing '[object Object]' when a verbose JSON output is wanted
 * Fix command parser cleaning '-' character
 * Fix formatting when sending long messages
 * Fix saving not self-recovering on error
 * Change how SableyeBot checks if a Pokemon can learn a move

###2.5.0 - 2017-01-31
 * Fix `filter` producing nonsensical output in console
 * Add `save` mod command, forcing SableyeBot to instantly save usage information
 * Recover SableyeBot upon unknown disconnect

#####2.4.4 - 2017-01-28
 * Fix `move` recognizing Hidden Powers
 * Fix `learn` not considering Hidden Power [types]
 * Reconnect improvements

#####2.4.3 - 2017-01-19
 * Fix `learn` thinking Alolan mons can learn some moves that it actually cannot

#####2.4.2 - 2017-01-18
 * Add `evolve` command
 * Fix `savedata` without prefix

#####2.4.1 - 2017-01-15
 * Add `savedata` mod command
 * Fix logging once per minute instead of once per day
 * Remove unneeded dependencies

###2.4.0 - 2017-01-15
 * Add logging
 * Fix `data` command not returning usage
 * Fix `nature` formatting

#####2.3.1 - 2017-01-14
 * Changed `data` long description
 * Slightly more descriptive error handling

###2.3.0 - 2017-01-10
 * Show server ID in `listservers`
 * Changed `learn` and `filter` behavior so Sketch's effects are ignored.
 * Changed how flags are handled
 * Changed pre-formatting so that mod commands can include spaces in their arguments (do not worry; we are responsible)
 * Add `setstatus` mod command
 * Add `setgame` mod command
 * Add `analyzeuser` mod command

### 2.2.0 - 2017-01-08
 * Fix not correctly parsing Mega Pokemon names
 * Fix versioning numbers, according to Semantic Versioning
 * Add `help help` hack
 * Add `listservers` mod command

### 2.1.0 - 2017-01-08
 * Add monotype to the filter command
 * Fix utils.recognize() not triggering
 * Fix a few typos

### 2.0.1 - 2017-01-07
 * Fix flag parsing
 * Fix filter command on non-special attributes
 * Made README formatting better

# 2.0.0 - 2017-01-07
 * Initial re-release