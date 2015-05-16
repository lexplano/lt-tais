var expect = require("chai").expect,
	parseIndexMetaLine = require("../lib/parseIndexMetaLine");

describe("parseIndexMetaLine", function () {

	function testParser(input, expectedOutput) {
		it(input, function () {
			expect(parseIndexMetaLine(input)).to.eql(expectedOutput);
		})
	}

	describe("statuses", function () {
		testParser("Įsigaliojo 2015-01-01", [
			{k: "statusas", v: {status: "Įsigaliojo", statusDate: "2015-01-01"}}
		]);

		testParser("Įsigaliojo 2015-01-01; Ratifikuota 2015-02-01", [
			{k: "statusas", v: {status: "Įsigaliojo", statusDate: "2015-01-01"}},
			{k: "statusas", v: {status: "Ratifikuota", statusDate: "2015-02-01"}}
		]);

		testParser("Įsigaliojo 2015-01-01; Ratifikuota 2015-03-01; Nepasirašytas 2015-02-01", [
			{k: "statusas", v: {status: "Įsigaliojo", statusDate: "2015-01-01"}},
			{k: "statusas", v: {status: "Ratifikuota", statusDate: "2015-03-01"}},
			{k: "statusas", v: {status: "Nepasirašytas", statusDate: "2015-02-01"}}
		]);

		testParser("Prisijungta 1993-05-03; Pasirašyta 1993-05-14; Ratifikuota 1995-04-27; Ratifikaciniai raštai deponuoti 1995-06-20; Įsigaliojo 1995-06-20; Nauja redakcija 1998-11-04", [
			{k: "statusas", v: {status: "Prisijungta", statusDate: "1993-05-03"}},
			{k: "statusas", v: {status: "Pasirašyta", statusDate: "1993-05-14"}},
			{k: "statusas", v: {status: "Ratifikuota", statusDate: "1995-04-27"}},
			{k: "statusas", v: {status: "Ratifikaciniai raštai deponuoti", statusDate: "1995-06-20"}},
			{k: "statusas", v: {status: "Įsigaliojo", statusDate: "1995-06-20"}},
			{k: "statusas", v: {status: "Nauja redakcija", statusDate: "1998-11-04"}}
		]);

		testParser("Taikoma; Ratifikuota 2001-08-02; Įsigaliojo 2002-03-24", [
			{k: "statusas", v: {status: "Taikoma", statusDate: undefined}},
			{k: "statusas", v: {status: "Ratifikuota", statusDate: "2001-08-02"}},
			{k: "statusas", v: {status: "Įsigaliojo", statusDate: "2002-03-24"}}
		]);

	});

	describe("publications", function () {

		testParser("Valstybės žinios: 2001-05-05 Nr.1234-55", [
			{k: "skelbta", v: {publication: "Valstybės žinios", pubDate: "2001-05-05", pubNo: "1234-55"}}
		]);

		testParser("Teisės aktų registras: 2001-05-05 Nr.1234-55", [
			{k: "skelbta", v: {publication: "Teisės aktų registras", pubDate: "2001-05-05", pubNo: "1234-55"}}
		]);

		testParser("Teisės aktų informacinė sistema: 2014-01-29 Nr.", [
			{k: "skelbta", v: {publication: "Teisės aktų informacinė sistema", pubDate: "2014-01-29", pubNo: undefined}}
		]);

		testParser("Teisės aktų registras: 2001-05-05 Nr.1234-55; 2001-06-06 Nr.777-88", [
			{k: "skelbta", v: {publication: "Teisės aktų registras", pubDate: "2001-05-05", pubNo: "1234-55"}},
			{k: "skelbta", v: {publication: "Teisės aktų registras", pubDate: "2001-06-06", pubNo: "777-88"}}
		]);

		testParser("Valstybės žinios: 1998-12-03 Nr.106(1)-2931; 1998-12-08 Nr.106(2); 1998-12-23 Nr.106(3); 1999-01-21 Nr.106(4); 1999-01-26 Nr.106(5)", [
			{k: "skelbta", v: {publication: "Valstybės žinios", pubDate: "1998-12-03", pubNo: "106(1)-2931"}},
			{k: "skelbta", v: {publication: "Valstybės žinios", pubDate: "1998-12-08", pubNo: "106(2)"}},
			{k: "skelbta", v: {publication: "Valstybės žinios", pubDate: "1998-12-23", pubNo: "106(3)"}},
			{k: "skelbta", v: {publication: "Valstybės žinios", pubDate: "1999-01-21", pubNo: "106(4)"}},
			{k: "skelbta", v: {publication: "Valstybės žinios", pubDate: "1999-01-26", pubNo: "106(5)"}}
		]);

	});

	describe("latest notification", function () {

		testParser('<span style="color:red; font-weight:bold">NEAKTUALI</span>&nbsp;<span><a title="Dokumento paskutinė aktuali redakcija" href="http://www3.lrs.lt/pls/inter3/dokpaieska.showdoc_l?p_id=494148"><small>[žr. šiuo metu galiojančią aktualiąją redakciją]</small></a></span>', [
			{ k: "notification", v: "NEAKTUALI" },
			{ k: "tais_latest_id", v: "494148" }
		]);

		testParser('<span style="color:red; font-weight:bold">PAKEISTAS</span>&nbsp;<span><a title="Dokumento paskutinė aktuali redakcija" href="http://www3.lrs.lt/pls/inter3/dokpaieska.showdoc_l?p_id=470356"><small>[žr. aktualiąją redakciją]</small></a></span>', [
			{ k: "notification", v: "PAKEISTAS" },
			{ k: "tais_latest_id", v: "470356" }
		]);

	});

});
