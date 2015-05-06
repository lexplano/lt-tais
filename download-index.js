var moment = require("moment"),
	qs = require("querystring"),
	path = require("path"),
	_ = require("lodash"),
	sprintf = require("sprintf-js").sprintf;

var ISO_DATE = "YYYY-MM-DD",
	CRAWL_DELAY = 1,
	PARALLEL_DOWNLOADS = 1;

var args = require("yargs")
	.usage('Usage: $0 [options]')
	.option("from", {type: "string", default: undefined})
	.option("to", {type: "string", default: moment().endOf("month").format(ISO_DATE)})
	.option("save-path", {type: "string", demand: true})
	.argv;

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
	// @todo: implement
	cb(null, Math.round(Math.random() * 10) + 1);
}

function getFn(query) {
	return path.resolve(path.join(
		args["save-path"],
		query["p_iki"].substring(0, 4),
		sprintf("%s-%04d.html", query["p_iki"], query["p_no"])
	));
}

function saveResults(query, res) {
	// @todo: mkdirp
	var fn = getFn(query);
	console.log("Saving", {query: query, fn: fn});
	// @todo: write out
}

function retry(query) {
	console.warn("Retrying", {query: query});
	queue.push(query); // retry
	downloadNext();
}

function onReceived(query) {
	return function (err, res) {
		if (err) return retry(query);

		saveResults(query, res);

		if (query["p_no"] !== 1) {
			downloadNext();
			return;
		}

		getNumAvailablePages(res, function (err, numPages) {
			if (err) return retry(query);

			for (var i = 2; i <= numPages; i++) {
				var newQuery = _.clone(query);
				newQuery["p_no"] = i;
				queue.push(newQuery);
			}

			downloadNext();
		});
	}
}

function downloadNext() {
	setTimeout(function () {

		if (!queue.length) return;

		var query = queue.shift();
		var url = "http://www3.lrs.lt/pls/inter3/dokpaieska.rezult_l?" + qs.stringify(query);
		console.log("Downloading", {query: query, url: url});

		// @todo: request
		onReceived(query)(null, "10");

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
