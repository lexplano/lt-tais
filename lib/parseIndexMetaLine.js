"use strict";

var _ = require("lodash"),
	escapeRe = require("escape-string-regexp"),
	tryParseActions = require("./parseIndex/tryParseActions"),
	tryParseAttachment = require("./parseIndex/tryParseAttachment"),
	tryParseNotification = require("./parseIndex/tryParseNotification"),
	tryParsePublications = require("./parseIndex/tryParsePublications"),
	tryParseStatuses = require("./parseIndex/tryParseStatuses");

function parseIndexMetaLine(metaLine) {
	var matches;

	if (matches = metaLine.match(/^<!-- l_paskutine_red=(\d+)? l_dok_key=(\d+) -->$/)) {
		if (matches[1] !== matches[2]) {
			return [
				{k: "tais_latest_id", v: matches[1]},
				{k: "tais_id", v: matches[2]}
			]
		} else {
			return;
		}
	}
	if (matches = metaLine.match(/^([\w\W]*)<!-- l_paskutine_red=(\d+) l_dok_key=(\d+) -->$/)) {
		var res = [];
		res.push(parseIndexMetaLine(matches[1].trim()));
		if (matches[2] !== matches[3]) {
			res.push([
				{k: "tais_latest_id", v: matches[2]},
				{k: "tais_id", v: matches[3]}
			]);
		}
		return res;
	}

	return tryParseNotification(metaLine) ||
		tryParseStatuses(metaLine) ||
		tryParsePublications(metaLine) ||
		tryParseActions(metaLine) ||
		tryParseAttachment(metaLine) ||
		[{k: "__unparsed", v: metaLine}];
}

module.exports = parseIndexMetaLine;
