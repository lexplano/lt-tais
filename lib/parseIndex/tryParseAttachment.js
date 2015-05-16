var _ = require("lodash"),
	escapeRe = require("escape-string-regexp");

var ATTACHMENT_REGEXP = new RegExp("^"
	+ escapeRe('&nbsp;[Priedas: \n')
	+ "([^&]+)"
	+ escapeRe('&nbsp;<a class="normalus" href="http://www3.lrs.lt/pls/inter3/dokpaieska.dok_priedas?p_id=')
	+ "(\\d+)"
	+ escapeRe('" title="Priedas originalas"><img border="0" alt="Priedas originalas" src="http://www3.lrs.lt/dokpaieska/ico_')
	+ "(\\w+)"
	+ escapeRe('.gif" class="s"></a>\n]')
	+ "$");

var ALL_ATTACHMENTS_LINK_REGEXP = new RegExp("^"
	+ escapeRe('<span>&nbsp;<a href=\"http://www3.lrs.lt/pls/inter3/dokpaieska.showdoc_l?p_id=')
	+ "(\\d+)"
	+ escapeRe('&amp;p_query=&amp;p_tr2=2#prd\" title=\"Dokumento antraštėje nurodyti priedai\">[Priedai]</a></span>')
	+ "$");

function tryParseAttachment(metaLine) {
	var allMatches = metaLine.match(ALL_ATTACHMENTS_LINK_REGEXP);
	if (allMatches) {
		return [{
			k: "attachment",
			v: {
				taisId: allMatches[1]
			}
		}]
	}

	var matches = metaLine.match(ATTACHMENT_REGEXP);
	if (!matches) return false;

	return [{
		k: "attachment",
		v: {
			file: matches[1] + "." + matches[3],
			attachmentId: matches[2]
		}
	}]
}

module.exports = tryParseAttachment;
