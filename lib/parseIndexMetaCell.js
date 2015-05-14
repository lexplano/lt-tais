var _ = require("lodash");

function parseMetaLine(metaLine) {
	var matches;
	if (metaLine === "<span style=\"color:red; font-weight:bold\">PAKEISTAS</span>" ||
		metaLine === "<span style=\"color:red; font-weight:bold\">NEGALIOJA</span>" ||
		metaLine === "<span style=\"color:red; font-weight:bold\">NEAKTUALI</span>") {
		return;
	}
	if (matches = metaLine.match(/^<!-- l_paskutine_red=(\d+) l_dok_key=(\d+) -->$/)) {
		if (matches[1] !== matches[2]) {
			return [
				{k: "tais_aktuali_id", v: matches[1]},
				{k: "tais_id", v: matches[2]}
			]
		} else {
			return;
		}
	}
	if (matches = metaLine.match(/^(.*)\n<!-- l_paskutine_red=(\d+) l_dok_key=(\d+) -->$/)) {
		var res = [];
		res.push(parseMetaLine(matches[1]));
		if (matches[2] !== matches[3]) {
			res.push([
				{k: "tais_aktuali_id", v: matches[2]},
				{k: "tais_id", v: matches[3]}
			]);
		}
		return res;
	}
	if (matches = metaLine.match(/^Įsigaliojo (\d\d\d\d-\d\d-\d\d)$/)) {
		return {k: "isigaliojo", v: matches[1]};
	}
	if (matches = metaLine.match(/^Įsigaliojo (\d\d\d\d-\d\d-\d\d); Ratifikuota (\d\d\d\d-\d\d-\d\d)$/)) {
		return [
			{k: "isigaliojo", v: matches[1]},
			{k: "ratifikuota", v: matches[2]}
		];
	}
	if (matches = metaLine.match(/^Ratifikuota (\d\d\d\d-\d\d-\d\d); Įsigaliojo (\d\d\d\d-\d\d-\d\d)$/)) {
		return [
			{k: "isigaliojo", v: matches[2]},
			{k: "ratifikuota", v: matches[1]}
		];
	}
	if (matches = metaLine.match(/^Ratifikuota (\d\d\d\d-\d\d-\d\d)$/)) {
		return [
			{k: "ratifikuota", v: matches[1]}
		];
	}
	if (matches = metaLine.match(/^Įsigaliojo nuo (\d\d\d\d-\d\d-\d\d) iki (\d\d\d\d-\d\d-\d\d); Negalioja (\d\d\d\d-\d\d-\d\d)$/)) {
		return [
			{k: "isigaliojo", v: matches[1]},
			{k: "isigaliojo_iki", v: matches[2]},
			{k: "negalioja", v: matches[3]}
		];
	}
	if (matches = metaLine.match(/^Aktuali nuo (\d\d\d\d-\d\d-\d\d) iki (\d\d\d\d-\d\d-\d\d)$/)) {
		return [
			{k: "aktuali_nuo", v: matches[1]},
			{k: "aktuali_iki", v: matches[2]}
		];
	}
	if (matches = metaLine.match(/^Parengė: (.*)$/)) {
		return {k: "parenge", v: matches[1]};
	}
	if (matches = metaLine.match(/^Priėmė: (.*)$/)) {
		return {k: "prieme", v: matches[1]};
	}
	if (matches = metaLine.match(/^Teisės aktą priėmė: (.*)$/)) {
		return {k: "prieme", v: matches[1]};
	}
	if (matches = metaLine.match(/^Seimo posėdis: (.*)$/)) {
		return {k: "seimo_posedis", v: matches[1]};
	}
	if (matches = metaLine.match(/^Stenogramos: (.*)$/)) {
		return {k: "stenogramos", v: matches[1]};
	}
	if (matches = metaLine.match(/^Valstybės žinios: (\d\d\d\d-\d\d-\d\d) Nr.([\d\-\(\)]+)$/)) {
		return {
			k: "skelbta", v: {
				publication: "Valstybės žinios",
				pubDate: matches[1],
				pubNo: matches[2]
			}
		};
	}
	if (matches = metaLine.match(/^Vedomosti Litovskoi Respubliki: (\d\d\d\d-\d\d-\d\d) Nr.([\d\-\(\)]+)$/)) {
		return {
			k: "skelbta", v: {
				publication: "Vedomosti Litovskoi Respubliki",
				pubDate: matches[1],
				pubNo: matches[2]
			}
		};
	}
	if (matches = metaLine.match(/^Parliamentary record: (\d\d\d\d-\d\d-\d\d) Nr.([\d\-\(\)]+)$/)) {
		return {
			k: "skelbta", v: {
				publication: "Parliamentary record",
				pubDate: matches[1],
				pubNo: matches[2]
			}
		};
	}

	return [{k: "__unparsed", v: metaLine}];
}

function parseMeta(infoHtml) {
	return _(infoHtml.split("<br>"))
		.map(function (s) {
			return s.trim();
		})
		.filter()
		.map(parseMetaLine)
		.flattenDeep()
		.filter()
		.value();
}

module.exports = parseMeta;
