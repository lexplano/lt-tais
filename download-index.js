var moment = require("moment"),
	Q = require("q"),
	qs = require("querystring"),
	fs = require("fs"),
	path = require("path"),
	_ = require("lodash"),
	sprintf = require("sprintf-js").sprintf,
	request = require("request"),
	mkdirp = require("mkdirp"),
	USER_AGENT = require("./lib/userAgent"),
	rangeToMonths = require("./lib/rangeToMonths");

var ISO_DATE = "YYYY-MM-DD",
	PARALLEL_DOWNLOADS = 1,
	RESULTS_PER_PAGE = 30;

var args = require("yargs")
	.usage('Usage: $0 [options]')
	.option("from", {type: "string", default: undefined})
	.option("to", {type: "string", default: moment().endOf("month").format(ISO_DATE)})
	.option("save-path", {type: "string", demand: true})
	.option("max-downloads", {type: "number", default: undefined})
	.option("crawl-delay", {type: "number", default: 20})
	.argv;

var MAX_DOWNLOADS = args["max-downloads"],
	CRAWL_DELAY = args["crawl-delay"];

function getNumAvailablePages(res) {
	var matches = res.body.toString().match(/viso - <b>(\d+)<\/b>/);
	if (!matches) {
		throw new Error("Body does not match regex");
	}

	return Math.floor(parseInt(matches[1], 10) / RESULTS_PER_PAGE) + 1;
}

function getFn(query) {
	return path.resolve(path.join(
		args["save-path"],
		query["p_iki"].substring(0, 4),
		sprintf("%s-%04d.html", query["p_iki"], query["p_no"])
	));
}

function saveResults(query, res) {
	var fn = getFn(query);
	var dirname = path.dirname(fn);

	return Q.nfcall(mkdirp, dirname)
		.then(function () {
			return Q.ninvoke(fs, "writeFile", fn, res.body);
		})
		.then(function () {
			return res;
		});
}

function queueNext(query, res) {

	if (query["p_no"] !== 1) {
		return;
	}

	return Q.fcall(getNumAvailablePages, res).then(function (numPages) {
		for (var i = 2; i <= numPages; i++) {
			var newQuery = _.clone(query);
			newQuery["p_no"] = i;
			queue.push(newQuery);
		}
		console.log("Queuing", {query: query, numPages: numPages});
	});

}

function getRequestOptions(query) {
	return {
		url: "http://www3.lrs.lt/pls/inter3/dokpaieska.rezult_l?" + qs.stringify(query),
		encoding: null,
		headers: {
			"user-agent": USER_AGENT
		}
	};
}

var downloadedCounter = 0;
function downloadNext() {
	if (!queue.length) {
		return;
	}

	downloadedCounter++;
	if (MAX_DOWNLOADS && downloadedCounter > MAX_DOWNLOADS) {
		return;
	}

	var query = queue.shift();
	Q.delay(CRAWL_DELAY * 1000)
		.then(function () {
			console.log("Downloading", {query: query, queueLength: queue.length});
			return Q.nfcall(request, getRequestOptions(query))
		})
		.spread(function (res) {
			console.log("Saving", {query: query, bodyLength: res.body.length});
			return saveResults(query, res);
		})
		.then(function (res) {
			return queueNext(query, res);
		})
		.catch(function (err) {
			console.error("Retrying", {query: query, error: err});
			queue.push(query); // retry
		})
		.then(function () {
			downloadNext();
		})
		.done();
}

function dateRangeToQuery(i) {
	var query = {};

	if (i.from) {
		query["p_nuo"] = i.from;
	}

	if (i.to) {
		query["p_iki"] = i.to;
	}

	query["p_no"] = 1;

	return query;
}

var queue = rangeToMonths(args.from, args.to).map(dateRangeToQuery);

for (var i = 0; i < PARALLEL_DOWNLOADS; i++) {
	downloadNext();
}
