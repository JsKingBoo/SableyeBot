'use strict';

var cluster = require("cluster");
var sableye = require("./sableye.js");

if (cluster.isMaster) {
	cluster.fork();

	cluster.on("exit", function(worker, code, signal) {
		console.log("Cluster exit and trying to re-fork.");
		setTimeout(() => {
			cluster.fork();
		}, 10000);
	});
}

if (cluster.isWorker) {
	sableye();
}
