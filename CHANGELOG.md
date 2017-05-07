##### 2.8.1 - 2017-05-07
 * Fix `filter` not recognizing false values
 * Fix outdated config.json.example
 * Remove 'missingno' flag in `weightcoverage`

### 2.8.0 - 2017-05-04
 * Add back, shiny, and female sprites.
 * Add Pokemon name in output for `weakness`, `coverage`, and `weightcoverage`
 * Update options system: affects `filter`, `sprite`, and `weightcoverage`
 * Fix `learn` not recognizing moves learned from gen 1 virtual console transfers
 * Remove `commands` alias for `help`

##### 2.7.2 - 2017-04-17
 * Add dancer to move flags
 * Add additional logging to saving functions	
 * Change usage syntax for some commands
 * Fix logging not recording help commands

##### 2.7.1 - 2017-03-29
 * Fix `filterm` not parsing zMoveBoost correctly
 * Prevent SableyeBot from spamming in PM/DM channels
 
### 2.7.0 - 2017-03-28
 * Add `updatedb` mod command
 * Changed `listservers` behavior
 * Changed logging to use Promises rather than function silently
 * Changed `save` behavior to be more reliable
 * Changed `disconnect` behavior to save data more reliably
 * Fix not correctly parsing Pokemon names with '-' correctly
 * Fix `filter` not recognizing the 'alola' flag when searching movesets
 * Fix `ability` not looking up a misspelled input
 * Fix `sprite` not parsing some Pokemon names correctly

##### 2.6.2 - 2017-03-15
 * Fix CommandManager default variables again

##### 2.6.1 - 2017-03-15
 * Fix CommandManager not defaulting clean to true properly

### 2.6.0 - 2017-03-14
 * Add `weightcoverage` command
 * Add `filterm` command
 * Add evolution and prevolution checking to `filter` command
 * Fix `filter` command hanging when user inputs multiple threshold arguments
 * Fix `eval` mod command outputing '[object Object]' when a verbose JSON output is wanted
 * Fix command parser cleaning '-' character
 * Fix formatting when sending long messages
 * Fix saving not self-recovering on error
 * Change how SableyeBot checks if a Pokemon can learn a move

### 2.5.0 - 2017-01-31
 * Fix `filter` producing nonsensical output in console
 * Add `save` mod command, forcing SableyeBot to instantly save usage information
 * Recover SableyeBot upon unknown disconnect

##### 2.4.4 - 2017-01-28
 * Fix `move` recognizing Hidden Powers
 * Fix `learn` not considering Hidden Power [types]
 * Reconnect improvements

##### 2.4.3 - 2017-01-19
 * Fix `learn` thinking Alolan mons can learn some moves that it actually cannot

##### 2.4.2 - 2017-01-18
 * Add `evolve` command
 * Fix `savedata` without prefix

##### 2.4.1 - 2017-01-15
 * Add `savedata` mod command
 * Fix logging once per minute instead of once per day
 * Remove unneeded dependencies

### 2.4.0 - 2017-01-15
 * Add logging
 * Fix `data` command not returning usage
 * Fix `nature` formatting

##### 2.3.1 - 2017-01-14
 * Changed `data` long description
 * Slightly more descriptive error handling

### 2.3.0 - 2017-01-10
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