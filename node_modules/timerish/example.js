var timerish = require("./index");
var tick = timerish();
tick("One");
setTimeout(function () {
	tick("Two", 3);
	tick.start("Custom");
	setTimeout(function () {
		tick("Three");
		setTimeout(function () {
			tick.stop("Custom", "OK");
			console.log(tick.log);
		}, 100);
	}, 100);
}, 100);
