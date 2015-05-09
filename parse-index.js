var assert = require("assert"),
	glob = require("glob"),
	path = require("path"),
	_ = require("lodash"),
	Q = require("q"),
	jsdom = require("jsdom"),
	iconv = require("iconv-lite"),
	Timerish = require("timerish"),
	fs = require("fs");

var CHARSET = "windows-1257";

var args = require("yargs")
	.usage('Usage: $0 [options]')
	.option("index-path", {type: "string", demand: true})
	.option("save-to", {type: "string"})
	.argv;

function parseRow(row) {
	var cells = row.querySelectorAll("td");
	assert(cells.length === 5, "Incorrect number of cells: " + cells.length);

	var rowNumber = cells[0].textContent;
	assert(rowNumber.match(/^\d+$/), "Invalid row number" + rowNumber);

	var infoCell = cells[1].cloneNode(true);
	var elDocTitle = infoCell.querySelectorAll("span.dpav");
	assert(elDocTitle.length === 1, "Invalid number of titles:" + elDocTitle.length);
	assert(elDocTitle[0].children.length === 1, "Title span should only have one child");

	var elLink = elDocTitle[0].children[0];
	assert(elLink.tagName === "A", "Title span should have a link inside");
	assert(elLink.children.length === 0, "Link should have only text");

	elDocTitle[0].parentNode.removeChild(elDocTitle[0]);
	var unparsedMeta = infoCell.innerHTML;

	var docTitle = elLink.textContent;
	var docTaisUrl = elLink.getAttribute("href");

	var docDate = cells[2].textContent;
	assert(docDate.match(/^\w\w\w\w-\w\w-\w\w$/), "Invalid date: " + docDate);

	var docNo = cells[3].textContent;

	var docType = cells[4].textContent;
	//@todo: unicode...
	//assert(docType.match(/^[\w\s]+$/), "Invalid document type: " + docType);

	return {
		docDate: docDate,
		docTitle: docTitle,
		docTaisUrl: docTaisUrl,
		docType: docType,
		docNo: docNo,
		unparsedMeta: unparsedMeta
	};
}

function parseFile(fn) {
	console.log("Reading", {fn: fn});
	var tick = Timerish();
	return Q.ninvoke(fs, "readFile", fn)
		.then(function (data) {
			tick("read");
			var html = iconv.decode(data, CHARSET);

			tick("decode");
			console.log("Constructing DOM", {fn: fn});
			return Q.ninvoke(jsdom, "env", html, [], {features: {FetchExternalResources: []}, encoding: "windows-1257"})
		})
		.then(function (window) {
			var tables = window.document.body.querySelectorAll("table.basicnoborder");
			assert(tables.length === 1, "Incorrect number of table.basicnoborder in " + fn);

			var rows = tables[0].querySelectorAll("tr:not(:first-child)");

			var parsedDocs = _.map(rows, parseRow);
			tick("parsed");

			console.log("Parsed", {fn: fn, times: tick.log});
			return parsedDocs;
		})
		.catch(function (err) {
			console.error("Parsing failed", fn);
			throw err;
		});
}

Q.nfcall(glob, "**/*.html", {cwd: args["index-path"]})
	.then(function (res) {
		return Q.all(res.map(function (fn) {
			return parseFile(path.resolve(path.join(args["index-path"], fn)))
		}));
	})
	.then(function (res) {
		var parsed = _.flattenDeep(res);
		console.log(parsed);

		if (args["save-to"]) {
			return Q.ninvoke(fs, "writeFile", args["save-to"], JSON.stringify(parsed, null, "  "));
		}
	})
	.done();
