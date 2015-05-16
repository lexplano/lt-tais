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
			indexItem.meta = parseMeta(indexItem.metaHtml);
			cb(null, indexItem);
		}))
		.pipe(JSONStream.stringify())
		.pipe(process.stdout);
}
