( function() {
	window.jqTwitter = {};
	var searchUrl = "http://search.twitter.com/search.json";
	
	function buildUrl(term, data){
		var reqUrl = searchUrl + "?q=" + term + "&callback=?";
		for ( var key in data) {
			if (key != 'live')
				reqUrl += "&" + key + "=" + data[key];
		}
		return reqUrl;
	}
	try {
		jQuery.searchTwitter = function(term, data, callback) {
			var reqUrl = searchUrl + "?q=" + term + "&callback=?";
			if (jQuery.isFunction(data)) {
				callback = data;
				data = {};
			}
			jQuery.getJSON(buildUrl(term, data), callback);
		};
	} catch (e) {
		throw new Exception('jQuery is not defined!');
	}
})();
