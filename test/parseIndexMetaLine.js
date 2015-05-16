var expect = require("chai").expect,
	parseIndexMetaLine = require("../lib/parseIndexMetaLine");

describe("parseIndexMetaLine", function () {

	function testParser(input, expectedOutput) {
		it(input, function () {
			expect(parseIndexMetaLine(input)).to.eql(expectedOutput);
		})
	}

	testParser("Įsigaliojo 2015-01-01", [
		{
			k: "statusas",
			v: {
				status: "Įsigaliojo",
				statusDate: "2015-01-01"
			}
		}
	]);

	testParser("Įsigaliojo 2015-01-01; Ratifikuota 2015-02-01", [
		{
			k: "statusas",
			v: {
				status: "Įsigaliojo",
				statusDate: "2015-01-01"
			}
		},
		{
			k: "statusas",
			v: {
				status: "Ratifikuota",
				statusDate: "2015-02-01"
			}
		}
	]);

	testParser("Įsigaliojo 2015-01-01; Ratifikuota 2015-03-01; Nepasirašytas 2015-02-01", [
		{
			k: "statusas",
			v: {
				status: "Įsigaliojo",
				statusDate: "2015-01-01"
			}
		},
		{
			k: "statusas",
			v: {
				status: "Ratifikuota",
				statusDate: "2015-03-01"
			}
		},
		{
			k: "statusas",
			v: {
				status: "Nepasirašytas",
				statusDate: "2015-02-01"
			}
		}
	]);

});