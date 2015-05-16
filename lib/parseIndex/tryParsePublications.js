"use strict";

var _ = require("lodash"),
	escapeRe = require("escape-string-regexp");

var AVAILABLE_PUBLICATIONS = [
	"Valstybės žinios",
	"Teisės aktų registras",
	"Informaciniai pranešimai",
	"Oficialusis leidinys C",
	"Oficialusis leidinys L",
	"Oficialusis leidinys CE",
	"Teisės aktų informacinė sistema",
	"Vyriausybės žinios",
	"Lietuvos aidas",
	"Stenogramos",
	"Specialus Lietuvos Respublikos Seimo leidinys",
	"Parliamentary record",
	"Official Journal C",
	"Official Journal L",
	"Vedomosti Litovskoi Respubliki"
];

var PUBLICATIONS_REGEXP = new RegExp("^"
	+ "(" + AVAILABLE_PUBLICATIONS.map(escapeRe).join("|") + "): (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "(; (\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?)?"
	+ "$");

var PUBLICATION_DATE_REGEXP_PART = "(\\d\\d\\d\\d-\\d\\d-\\d\\d) Nr.([\\d\-\(\)]+)?( \\(<i>atitaisymas</i>\\))?",
	PUBLICATION_REGEXP_PART = "(" + AVAILABLE_PUBLICATIONS.map(escapeRe).join("|") + "): (((; )?" + PUBLICATION_DATE_REGEXP_PART + ")+)";

var PUBLICATION_LINE_REGEXP = new RegExp("^((; )?" + PUBLICATION_REGEXP_PART + ")+( \\(<small>(.*)</small>\\))?$"),
	PUBLICATION_EXTRACT_REGEXP = new RegExp(PUBLICATION_REGEXP_PART, "g"),
	PUBLICATION_PARSE_REGEXP = new RegExp("^" + PUBLICATION_REGEXP_PART + "$"),
	DATE_EXTRACT_REGEXP = new RegExp(PUBLICATION_DATE_REGEXP_PART, "g"),
	DATE_PARSE_REGEXP = new RegExp("^" + PUBLICATION_DATE_REGEXP_PART + "$");

function tryParsePublications(metaLine) {
	var matches = metaLine.match(PUBLICATION_LINE_REGEXP);
	if (!matches) return false;

	var publications =  _(metaLine.match(PUBLICATION_EXTRACT_REGEXP))
		.map(function (publication) {
			return publication.match(PUBLICATION_PARSE_REGEXP)
		})
		.map(function (pubMatches) {
			return pubMatches[2].match(DATE_EXTRACT_REGEXP)
				.map(function (pubDate) {
					return pubDate.match(DATE_PARSE_REGEXP)
				})
				.map(function (dateMatches) {
					var res = {
						k: "skelbta",
						v: {
							publication: pubMatches[1],
							pubDate: dateMatches[1],
							pubNo: dateMatches[2]
						}
					};
					if (dateMatches[3]) {
						res.v.correction = true;
					}
					return res
				});
		})
		.flatten()
		.value();

	if (matches[11]) {
		publications.push({
			k: "comment",
			v: matches[11]
		});
	}

	return publications;
}

module.exports = tryParsePublications;
