var loaderUtils = require("loader-utils");
module.exports = function(source) {
  var hamlc, query, req, template, result;
  this.cacheable && this.cacheable(true);
  //
  // Requires
  //
  hamlc     = require("haml-coffee");
  //
  // Loader
  //
  query     = loaderUtils.parseQuery(this.query);
  req       = loaderUtils.getRemainingRequest(this).replace(/^!/, "");
  //
  // Compilation
  //
  // template  = hamlc.template(source, null, null, {placement: 'standalone', escapeHtml: false});
	source = "- _ = (i18n) -> console.log("TRANSLATION : " + i18n) # needed for i18n translation\n" + source;
	template = hamlc.render(source, {}, {placement: 'standalone', escapeHtml: false, format: 'xhtml'});

	// if it's react-template, remove quotes from attributes
	// i.e. replace '{this.xx}' to {this.xx}
	if (query.rt) {
		function replaceTo(match, p1) {
			return "{" + p1 + "}";
		}
		template = template.replace(/'\{([^\}]+)}'/g, replaceTo);
	}
  result    = "module.exports =" + template;
  return result;
}
