var glob = require("glob"),
	path = require("path"),
	_ = require("lodash"),
	Q = require("q"),
	parseFile = require("./lib/parseIndexFile"),
	fs = require("fs");

var args = require("yargs")
	.usage('Usage: $0 [options]')
	.option("index-path", {type: "string", demand: true})
	.option("save-to", {type: "string"})
	.argv;


Q.nfcall(glob, "**/*.html", {cwd: args["index-path"]})
	.then(function (res) {
		return Q.all(res.map(function (fn) {
			return Q.nfcall(parseFile, path.resolve(path.join(args["index-path"], fn)));
		}));
	})
	.then(function (res) {
		var parsed = _(res)
			.flattenDeep()
			.sortByAll("docDate", function (i) {
				return +i.docTaisId;
			})
			.reverse()
			.value();

		if (args["save-to"]) {
			return Q.ninvoke(fs, "writeFile", args["save-to"], JSON.stringify(parsed, null, "  "));
		}

		console.log(parsed);
	})
	.done();
