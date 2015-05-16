"use strict";

var escapeRe = require("escape-string-regexp");

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

function tryParsePublications(metaLine) {
	var matches = metaLine.match(PUBLICATIONS_REGEXP);
	if (!matches) return false;

	var publications = [];
	publications.push({
		k: "skelbta",
		v: {
			publication: matches[1],
			pubDate: matches[2],
			pubNo: matches[3]
		}
	});
	for (let i = 4; i < matches.length; i += 3) {
		if (matches[i]) {
			publications.push({
				k: "skelbta",
				v: {
					publication: matches[1],
					pubDate: matches[i + 1],
					pubNo: matches[i + 2]
				}
			});
		}
	}
	return publications;
}

module.exports = tryParsePublications;
