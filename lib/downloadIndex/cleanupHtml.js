var iconv = require("iconv-lite");

var CHARSET = "windows-1257";

function cleanupHtml(buf) {
	return iconv.decode(buf, CHARSET)
		.replace(CHARSET, "utf-8")
		.replace(/&p_sess=[0-9A-F]{32}/g, "")
		.replace(/Paieškos laikas - <b>\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d<\/b>/, "Paieškos laikas - <b>0000-00-00 00:00:00</b>")
		.replace(/Puslapio kūrimas - <b>\d.\d\d<\/b>/, "Puslapio kūrimas - <b>0.00<\/b>");
}

module.exports = cleanupHtml;
