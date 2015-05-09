var expect = require("chai").expect,
	rangeToMonths = require("../lib/rangeToMonths");

function testRange(from, to, expected) {
	it(from + " to " + to, function () {
		expect(rangeToMonths(from, to)).to.eql(expected);
	});
}

describe("rangeToMonths", function () {

	testRange("2015-01-01", "2015-01-31", [
		{from: "2015-01-01", to: "2015-01-31"}
	]);

	testRange("2015-01-01", "2015-05-31", [
		{from: "2015-01-01", to: "2015-01-31"},
		{from: "2015-02-01", to: "2015-02-28"},
		{from: "2015-03-01", to: "2015-03-31"},
		{from: "2015-04-01", to: "2015-04-30"},
		{from: "2015-05-01", to: "2015-05-31"}
	]);

	testRange("2015-01-01", "2015-05-09", [
		{from: "2015-01-01", to: "2015-01-31"},
		{from: "2015-02-01", to: "2015-02-28"},
		{from: "2015-03-01", to: "2015-03-31"},
		{from: "2015-04-01", to: "2015-04-30"},
		{from: "2015-05-01", to: "2015-05-31"}
	]);

	testRange("2015-01-01", "2015-06-01", [
		{from: "2015-01-01", to: "2015-01-31"},
		{from: "2015-02-01", to: "2015-02-28"},
		{from: "2015-03-01", to: "2015-03-31"},
		{from: "2015-04-01", to: "2015-04-30"},
		{from: "2015-05-01", to: "2015-05-31"},
		{from: "2015-06-01", to: "2015-06-30"}
	]);

	testRange(undefined, "1990-03-31", [
		{from: undefined, to: "1990-03-31"}
	]);

	testRange(undefined, "1989-08-23", [
		{from: undefined, to: "1990-03-31"}
	]);

	testRange("1988-06-03", "1989-08-23", [
		{from: undefined, to: "1990-03-31"}
	]);

	testRange(undefined, "1991-01-13", [
		{from: undefined, to: "1990-03-31"},
		{from: "1990-04-01", to: "1990-04-30"},
		{from: "1990-05-01", to: "1990-05-31"},
		{from: "1990-06-01", to: "1990-06-30"},
		{from: "1990-07-01", to: "1990-07-31"},
		{from: "1990-08-01", to: "1990-08-31"},
		{from: "1990-09-01", to: "1990-09-30"},
		{from: "1990-10-01", to: "1990-10-31"},
		{from: "1990-11-01", to: "1990-11-30"},
		{from: "1990-12-01", to: "1990-12-31"},
		{from: "1991-01-01", to: "1991-01-31"}
	]);

});
