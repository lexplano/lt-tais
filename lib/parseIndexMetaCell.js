var _ = require("lodash"),
	parseIndexMetaLine = require("./parseIndexMetaLine");

function parseMeta(infoHtml) {
	return _(infoHtml.split("<br>"))
		.map(function (s) {
			return s.trim();
		})
		.filter()
		.map(parseIndexMetaLine)
		.flattenDeep()
		.filter()
		.value();
}

module.exports = parseMeta;

if (require.main === module) {
	var es = require("event-stream"),
		JSONStream = require("JSONStream"),
		util = require("util");

	process.stdin
		.pipe(JSONStream.parse("*"))
		.pipe(es.map(function (indexItem, cb) {
			var meta = parseMeta(indexItem.metaHtml);
			if (_.filter(meta, function (metaItem) {
					return metaItem.k === "__unparsed" && metaItem.v.indexOf("[Pried") < 0
				}).length > 0) {
				cb(null, [
					indexItem.docTaisUrl,
					indexItem.metaHtml,
					util.inspect(meta),
					"",
					""
				].join("\n"));
				return;
			}
			cb();
		}))
		.pipe(process.stdout);
}
