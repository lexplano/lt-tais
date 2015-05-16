"use strict";

var escapeRe = require("escape-string-regexp");

var AKTUALI_LINK_REGEXP = new RegExp("^"
	+ escapeRe('<span style="color:red; font-weight:bold">')
	+ "(NEAKTUALI|PAKEISTAS|NEGALIOJA)"
	+ escapeRe('</span>')
	+ "("
	+ escapeRe('&nbsp;<span><a title="Dokumento paskutinė aktuali redakcija" href="http://www3.lrs.lt/pls/inter3/dokpaieska.showdoc_l?p_id=')
	+ "(\\d+)"
	+ "("
	+ escapeRe('"><small>[žr. šiuo metu galiojančią aktualiąją redakciją]</small></a></span>')
	+ "|"
	+ escapeRe('"><small>[žr. aktualiąją redakciją]</small></a></span>')
	+ ")"
	+ ")?"
	+ "$");

function tryParseNotification(metaLine) {
	var matches = metaLine.match(AKTUALI_LINK_REGEXP);
	if (!matches) return false;

	var res = [{k: "notification", v: matches[1]}];
	if (matches[3]) {
		res.push({k: "taisLatestId", v: matches[3]})
	}
	return res;
}

module.exports = tryParseNotification;
