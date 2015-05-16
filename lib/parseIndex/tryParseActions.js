function tryParseActions(metaLine) {

	var matches;

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

	return false;
}

module.exports = tryParseActions;
