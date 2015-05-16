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


var STATUS_REGEXP_PART = "(" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ") ?(\\d\\d\\d\\d-\\d\\d-\\d\\d)?";

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
			return {
				k: "statusas",
				v: {
					"status": m[1],
					"statusDate": m[2]
				}
			}
		});
}

module.exports = tryParseStatuses;
