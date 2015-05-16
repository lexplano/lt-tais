"use strict";

var escapeRe = require("escape-string-regexp");

var AVAILABLE_STATUSES = [
	"Aktuali",
	"Atšauktas",
	"Denonsuota",
	"Grąžintas pataisymams",
	"Įsigaliojo",
	"Įsigaliojo (po sąlygų įvykdymo)",
	"Įsigalios",
	"Įsigalios (po sąlygų įvykdymo)",
	"Laikinai taikoma",
	"Laikinai sustabdytas",
	"Nauja redakcija",
	"Negalioja",
	"Negalioja (po sąlygų įvykdymo)",
	"Negalios",
	"Nepasirašytas",
	"Nepriimtas",
	"Pasirašyta",
	"Patvirtinta",
	"Pateiktas derinti suinteresuotoms institucijoms ir visuomenei",
	"Perduotas į archyvą",
	"Pirminis projektas",
	"Prezidento veto",
	"Priimtas teisės aktas",
	"Prijungtas prie kito projekto",
	"Prisijungimo dokumentai deponuoti",
	"Prisijungta",
	"Projektas atmestas",
	"Projektas atsiimtas",
	"Projektas priimtas",
	"Ratifikaciniai raštai deponuoti",
	"Ratifikuota",
	"Reguliuojantis verslo sąlygas",
	"Sustabdytas Konstitucinio teismo",
	"Taikoma"
];


var STATUS_REGEXP_PART = "("
	+ AVAILABLE_STATUSES.map(escapeRe).join("|")
	+ ")"
	+ "( "
	+ "("
	+ "(\\d\\d\\d\\d-\\d\\d-\\d\\d)"
	+ "|"
	+ "(nuo (\\d\\d\\d\\d-\\d\\d-\\d\\d) iki (\\d\\d\\d\\d-\\d\\d-\\d\\d))"
	+ "|"
	+ "(iki (\\d\\d\\d\\d-\\d\\d-\\d\\d))"
	+ ")"
	+ ")?";

var STATUS_LINE_REGEXP = new RegExp("^((; )?" + STATUS_REGEXP_PART + ")+$"),
	STATUS_EXTRACT_REGEXP = new RegExp(STATUS_REGEXP_PART, "g"),
	STATUS_PARSE_REGEXP = new RegExp("^" + STATUS_REGEXP_PART + "$");

function tryParseStatuses(metaLine) {

	var matches = metaLine.match(STATUS_LINE_REGEXP);
	if (!matches) return false;

	return metaLine.match(STATUS_EXTRACT_REGEXP)
		.map(function (s) {
			return s.match(STATUS_PARSE_REGEXP);
		})
		.map(function (m) {
			var res = {
				k: "status",
				v: {
					"status": m[1]
				}
			};

			if (m[6] && m[7]) {
				res.v.statusDateFrom = m[6];
				res.v.statusDateTo = m[7];
			} else if (m[9]) {
				res.v.statusDateTo = m[9];
			} else {
				res.v.statusDate = m[3]
			}
			return res
		});
}

module.exports = tryParseStatuses;
