module.exports = function () {

	var timerLog = {};
	var globalTimer = process.hrtime();

	var save = function (k, since, extraData) {
		var diff = process.hrtime(since);
		timerLog[k] = { k: k, t: diff[0] + diff[1] / 1e9 };
		if (extraData) timerLog[k].d = extraData;
	};

	var tick = function (k, extraData) {
		save(k, globalTimer, extraData);
		globalTimer = process.hrtime();
	};

	var namedTimers = {};
	tick.start = function (k) {
		namedTimers[k] = process.hrtime();
	};
	tick.stop = function (k, extraData) {
		if (!namedTimers[k]) return;
		save(k, namedTimers[k], extraData);
	};

	tick.log = timerLog;

	return tick;
};
