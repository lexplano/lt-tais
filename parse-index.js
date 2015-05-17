var glob = require("glob"),
	path = require("path"),
	_ = require("lodash"),
	Q = require("q"),
	qlimit = require("qlimit"),
	fs = require("graceful-fs"),
	readFile = qlimit(1000)(Q.nbind(fs.readFile, fs)),
	iconv = require("iconv-lite"),
	Timerish = require("timerish"),
	workerFarm = require("worker-farm"),
	parseIndexHtml = workerFarm(require.resolve("./lib/parseIndex/parseIndexHtml")),
	es = require("event-stream"),
	JSONStream = require("JSONStream");

var args = require("yargs")
	.usage('Usage: $0 [options]')
	.option("index-path", {type: "string", demand: true})
	.option("save-to", {type: "string"})
	.argv;

var CHARSET = "windows-1257";

function parseFile(fn) {
	console.log("Reading", {fn: fn});
	return readFile(fn).then(function (data) {
		var html = iconv.decode(data, CHARSET);
		return Q.nfcall(parseIndexHtml, fn, html);
	});
}

var tick = Timerish();
Q.nfcall(glob, "**/*.html", {cwd: args["index-path"]})
	.then(function (res) {
		tick("glob");
		return Q.all(res.map(function (fn) {
			var fullPath = path.resolve(path.join(args["index-path"], fn));
			return parseFile(fullPath);
		}));
	})
	.then(function (res) {
		tick("parsed");

		var parsed = _(res)
			.flattenDeep()
			.sortByAll("docDate", function (i) {
				return +i.docTaisId;
			})
			.reverse()
			.value();

		tick("sorted");
		if (args["save-to"]) {
			var willEnd = Q.defer();
			es.readArray(parsed)
				.pipe(JSONStream.stringify())
				.pipe(fs.createWriteStream(args["save-to"]))
				.on("finish", willEnd.resolve)
				.on("error", willEnd.reject);
			return willEnd.promise;
		}

		console.log(parsed);
	})
	.then(function () {
		tick("saved");

		workerFarm.end(parseIndexHtml);
		tick("end");

		console.log("Done", {timers: tick.log});
	})
	.done();
