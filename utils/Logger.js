'use strict';

//dependencies
var fs = require("fs");
var dateFormat = require("dateformat");

//files
var config = require(`${__dirname}/../bot/config.json`);
var current_session = require(`${__dirname}/../logs/current_session.json`);
var lifetime_session = require(`${__dirname}/../logs/lifetime_session.json`);

class Logger {
	/**
	 * @constructor
	 * @arg
	 */
	constructor() {
		
	}
	
	/**
	 * Get a timestamp
	 * @type {String}
	 */
	getTimestamp(){
		return `[${dateFormat(new Date(), "mmm dd HH:MM:ss:l")}] `;
	}
	
}

module.exports = Logger;