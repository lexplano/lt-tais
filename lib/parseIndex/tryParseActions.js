"use strict";

var escapeRe = require("escape-string-regexp");

var ACTIONS = [
	"Derinimui",
	"Įvedė",
	"Inicijavo",
	"Iškilmingas minėjimas",
	"Išvertė",
	"Pateikė",
	"Pateikė ratifikuoti",
	"Pateikė Vyriausybei",
	"Parengė",
	"Parengė ratifikavimui",
	"Pranešėjas",
	"Priėmė",
	"Seimo posėdis",
	"Suderino",
	"Susijusi organizacija",
	"Teisės aktą priėmė",
	"Tvirtino"
];

var ACTION_REGEXP_PART = "("
	+ ACTIONS.map(escapeRe).join("|")
	+ "): ([^;&]+)";

var ACTION_LINE_REGEXP = new RegExp("^((; )?" + ACTION_REGEXP_PART + ")+"
		+ "("
		+ escapeRe('&nbsp;<a class="normalus" title="Daugiau..." href="dokpaieska.showdoc_l?p_id=')
		+ "(\\d+)"
		+ escapeRe('&amp;p_daug=2">&gt;&gt;</a>')
		+ ")?"
		+ "$"),
	ACTION_EXTRACT_REGEXP = new RegExp(ACTION_REGEXP_PART, "g"),
	ACTION_PARSE_REGEXP = new RegExp("^" + ACTION_REGEXP_PART + "$");

function tryParseActions(metaLine) {
	var matches = metaLine.match(ACTION_LINE_REGEXP);
	if (!matches) return false;

	return metaLine.match(ACTION_EXTRACT_REGEXP)
		.map(function (s) {
			return s.match(ACTION_PARSE_REGEXP);
		})
		.map(function (m) {
			var res = {
				k: "action",
				v: {
					"action": m[1],
					"person": m[2]
				}
			};
			if (matches[6]) {
				res.v.etAl = true;
				res.v.taisId = matches[6];
			}
			return res;
		});
}

module.exports = tryParseActions;
