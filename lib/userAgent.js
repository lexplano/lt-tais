var sprintf = require("sprintf-js").sprintf;

var USER_AGENT = sprintf(
	"lexplano-tais-client/%s request/%s (+https://www.lexplano.com/)",
	require("../package.json").version,
	require("request/package.json").version
);

module.exports = USER_AGENT;
