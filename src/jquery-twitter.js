
( function() {
	var searches = {};
	var cache = {};
	var searchUrl = "http://search.twitter.com/search.json";
	
	function Controller(){
		this.handler = null;
		this.paused = false;
	}
	Controller.prototype.stop = function(){
		clearInterval(this.handler);
	};
	Controller.prototype.pause = function(){
		this.paused = true;
	}
	Controller.prototype.continueFeed = function(){
		this.pause = false
	}
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
			var control = new Controller();
			searches['last_id'+term] = 0;
			control.handler = setInterval(function(){
				data.since_id = searches['last_id'+term];
				jQuery.twitter.search(term, data, function(resp){
					var results = resp.results;
					if(results.length > 0){
						searches['last_id'+term] = results[0].id+1;
						callback.call(control, resp);
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
