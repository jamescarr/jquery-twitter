
( function() {
	var searches = {};
	var cache = {};
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
		jQuery.twitter = {};
		jQuery.twitter.liveSearch = function(term, data, callback){
			searches['last_id'+term] = 0;
			setInterval(function(){
				data.since_id = searches['last_id'+term];
				jQuery.twitter.search(term, data, function(resp){
					var results = resp.results;
					if(results.length > 0){
						searches['last_id'+term] = results[0].id+1;
						callback(resp);
					}
				});
			}, 5000);
		};
		jQuery.twitter.search = function(term, data, callback) {
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
