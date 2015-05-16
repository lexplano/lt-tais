"use strict";

var _ = require("lodash"),
	escapeRe = require("escape-string-regexp");

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

var STATUSES_REGEXP = new RegExp("^"
	+ "(" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "(; (" + AVAILABLE_STATUSES.map(escapeRe).join("|") + ")( \\d\\d\\d\\d-\\d\\d-\\d\\d)?)?"
	+ "$");

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

var AKTUALI_LINK_REGEXP = new RegExp("^"
	+ escapeRe('<span style="color:red; font-weight:bold">')
	+ "(NEAKTUALI|PAKEISTAS)"
	+ escapeRe('</span>&nbsp;<span><a title="Dokumento paskutinė aktuali redakcija" href="http://www3.lrs.lt/pls/inter3/dokpaieska.showdoc_l?p_id=')
	+ "(\\d+)"
	+ "("
	+ escapeRe('"><small>[žr. šiuo metu galiojančią aktualiąją redakciją]</small></a></span>')
	+ "|"
	+ escapeRe('"><small>[žr. aktualiąją redakciją]</small></a></span>')
	+ ")$");

function parseIndexMetaLine(metaLine) {
	var matches;
	if (metaLine === "<span style=\"color:red; font-weight:bold\">PAKEISTAS</span>" ||
		metaLine === "<span style=\"color:red; font-weight:bold\">NEGALIOJA</span>" ||
		metaLine === "<span style=\"color:red; font-weight:bold\">NEAKTUALI</span>") {
		return;
	}
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
	if (matches = metaLine.match(/^(.*)\n<!-- l_paskutine_red=(\d+) l_dok_key=(\d+) -->$/)) {
		var res = [];
		res.push(parseIndexMetaLine(matches[1]));
		if (matches[2] !== matches[3]) {
			res.push([
				{k: "tais_latest_id", v: matches[2]},
				{k: "tais_id", v: matches[3]}
			]);
		}
		return res;
	}

	if (matches = metaLine.match(AKTUALI_LINK_REGEXP)) {
		return [
			{k: "notification", v: matches[1]},
			{k: "tais_latest_id", v: matches[2]}
		]
	}

	if (matches = metaLine.match(STATUSES_REGEXP)) {
		var statuses = [];
		for (let i = 1; i < matches.length; i += 3) {
			if (matches[i]) {
				statuses.push({
					k: "statusas",
					v: {
						status: matches[i],
						statusDate: matches[i + 1] ? matches[i + 1].trim() : undefined
					}
				});
			}
		}
		return statuses;
	}

	if (matches = metaLine.match(PUBLICATIONS_REGEXP)) {
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

	if (matches = metaLine.match(/^Iškilmingas minėjimas: (.*); Parengė: (.*)$/)) {
		return [
			{k: "iskilmingas_minejimas", v: matches[1]},
			{k: "parenge", v: matches[2]}
		];
	}
	if (matches = metaLine.match(/^Parengė ratifikavimui: (.*); Pateikė: (.*)$/)) {
		return [
			{k: "parenge_ratifikavimui", v: matches[1]},
			{k: "pateike", v: matches[2]}
		];
	}
	if (matches = metaLine.match(/^Parengė: (.*); Pateikė: (.*)$/)) {
		return [
			{k: "parenge", v: matches[1]},
			{k: "pateike", v: matches[2]}
		];
	}
	if (matches = metaLine.match(/^Parengė: (.*)$/)) {
		return {k: "parenge", v: matches[1]};
	}
	if (matches = metaLine.match(/^Priėmė: (.*)$/)) {
		return {k: "prieme", v: matches[1]};
	}
	if (matches = metaLine.match(/^Pateikė: (.*)$/)) {
		return {k: "pateike", v: matches[1]};
	}
	if (matches = metaLine.match(/^Pateikė Vyriausybei: (.*)$/)) {
		return {k: "pateike_vyriausybei", v: matches[1]};
	}
	if (matches = metaLine.match(/^Inicijavo: (.*)$/)) {
		return {k: "inicijavo", v: matches[1]};
	}
	if (matches = metaLine.match(/^Įvedė: (.*)$/)) {
		return {k: "ivede", v: matches[1]};
	}
	if (matches = metaLine.match(/^Pranešėjas: (.*)$/)) {
		return {k: "pranesejas", v: matches[1]};
	}
	if (matches = metaLine.match(/^Teisės aktą priėmė: (.*)$/)) {
		return {k: "prieme", v: matches[1]};
	}
	if (matches = metaLine.match(/^Tvirtino: (.*)$/)) {
		return {k: "tvirtino", v: matches[1]};
	}
	if (matches = metaLine.match(/^Išvertė: (.*)$/)) {
		return {k: "isverte", v: matches[1]};
	}

	if (matches = metaLine.match(/^Seimo posėdis: (.*)$/)) {
		return {k: "seimo_posedis", v: matches[1]};
	}
	if (matches = metaLine.match(/^Stenogramos: (.*)$/)) {
		return {k: "stenogramos", v: matches[1]};
	}

	return [{k: "__unparsed", v: metaLine}];
}

module.exports = parseIndexMetaLine;
