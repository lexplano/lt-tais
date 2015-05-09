var moment = require("moment"),
	qs = require("querystring"),
	fs = require("fs"),
	path = require("path"),
	_ = require("lodash"),
	sprintf = require("sprintf-js").sprintf,
	request = require("request"),
	mkdirp = require("mkdirp"),
	USER_AGENT = require("./userAgent");

var ISO_DATE = "YYYY-MM-DD",
	CRAWL_DELAY = 1,
	PARALLEL_DOWNLOADS = 1,
	RESULTS_PER_PAGE = 30;

var args = require("yargs")
	.usage('Usage: $0 [options]')
	.option("from", {type: "string", default: undefined})
	.option("to", {type: "string", default: moment().endOf("month").format(ISO_DATE)})
	.option("save-path", {type: "string", demand: true})
	.option("max-downloads", {type: "number", default: undefined})
	.argv;

var MAX_DOWNLOADS = args["max-downloads"];

function getRange(from, to) {
	var monthsToDownload = [];
	if (!from || moment(from).isBefore("1990-03-31")) {
		monthsToDownload.push({
			from: undefined,
			to: moment("1990-03-31")
		});
	} else {
		monthsToDownload.push({
			from: moment(from).startOf("month"),
			to: moment(from).endOf("month")
		});
	}

	var endOfLastMonth = moment(to).endOf("month");

	var last;
	while ((last = monthsToDownload[monthsToDownload.length - 1]) && !last.to.isAfter(endOfLastMonth)) {
		monthsToDownload.push({
			from: last.to.clone().add(1, "month").startOf("month"),
			to: last.to.clone().add(1, "month").endOf("month")
		})
	}

	return monthsToDownload;
}

function getNumAvailablePages(res, cb) {
	setImmediate(function () {
		try {
			var matches = res.body.toString().match(/viso - <b>(\d+)<\/b>/);
			if (!matches) {
				cb(new Error("Body does not match regex"));
				return;
			}

			var numPages = Math.floor(parseInt(matches[1], 10) / RESULTS_PER_PAGE) + 1;
			cb(null, numPages);
		} catch (e) {
			cb(e);
		}
	});
}

function getFn(query) {
	return path.resolve(path.join(
		args["save-path"],
		query["p_iki"].substring(0, 4),
		sprintf("%s-%04d.html", query["p_iki"], query["p_no"])
	));
}

function saveResults(query, res, cb) {
	var fn = getFn(query);
	var dirname = path.dirname(fn);
	console.log("mkdirp", {query:query, dirname: dirname});
	mkdirp(dirname, function (err) {
		if (err) return cb(err);

		console.log("Saving", {query: query, fn: fn, bodyLength: res.body.length});
		fs.writeFile(fn, res.body, function (err) {
			console.log("Wrote", {fn: fn});
			cb(err, !err);
		});
	});
}

function retry(err, query) {
	console.warn("Retrying", {query: query, error: err});
	queue.push(query); // retry
	downloadNext();
}

function onSaved(query, res) {
	return function (err) {
		if (err) return retry(err, query);

		if (query["p_no"] !== 1) {
			downloadNext();
			return;
		}

		getNumAvailablePages(res, function (err, numPages) {
			if (err) return retry(err, query);

			for (var i = 2; i <= numPages; i++) {
				var newQuery = _.clone(query);
				newQuery["p_no"] = i;
				queue.push(newQuery);
			}

			downloadNext();
		});
	};
}

function onReceived(query) {
	return function (err, res) {
		if (err) return retry(err, query);

		saveResults(query, res, onSaved(query, res));
	}
}

function getRequestOptions(url) {
	return {
		url: url,
		encoding: null,
		headers: {
			"user-agent": USER_AGENT
		}
	};
}

var downloadedCounter = 0;
function downloadNext() {
	setTimeout(function () {

		if (!queue.length) return;

		downloadedCounter++;
		if (MAX_DOWNLOADS && downloadedCounter > MAX_DOWNLOADS) {
			process.exit();
		}
		var query = queue.shift();
		var url = "http://www3.lrs.lt/pls/inter3/dokpaieska.rezult_l?" + qs.stringify(query);
		console.log("Downloading", {query: query, url: url});

		request(getRequestOptions(url), onReceived(query));

	}, CRAWL_DELAY * 1000);
}

var queue = getRange(args.from, args.to).map(function (i) {
	var query = {};
	if (i.from) {
		query["p_nuo"] = i.from.format(ISO_DATE);
	}
	if (i.to) {
		query["p_iki"] = i.to.format(ISO_DATE);
	}

	query["p_no"] = 1;

	return query;
});

for (var i = 0; i < PARALLEL_DOWNLOADS; i++) {
	downloadNext();
}
