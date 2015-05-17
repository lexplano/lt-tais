var moment = require("moment");

var ISO_DATE_FORMAT = "YYYY-MM-DD",
	START_DATE = "1990-03-11";

module.exports = function (from, to) {

	var months = [];

	var current = from ? moment(from) : undefined,
		toMoment = moment(to).endOf("month");

	if (current && current.isBefore(START_DATE)) {
		current = undefined;
	}

	do {
		var month = {
			from: current ? current.clone().startOf("month") : undefined,
			to: (current || (current = moment(START_DATE))).clone().endOf("month")
		};
		months.push(month);
		current = current.clone().add(1, "month");
	} while (current.isBefore(toMoment));

	return months.map(function (m) {
		return {
			from: m.from ? m.from.format(ISO_DATE_FORMAT) : undefined,
			to: m.to.format(ISO_DATE_FORMAT)
		}
	});

};
