
( function() {
	var searches = {};
	var cache = {};
	var SEARCH_URL = "http://search.twitter.com/search.json";
        var TRENDS_URL = "http://search.twitter.com/trends/";
	var USER_TIMELINE_URL = 'http://twitter.com/statuses/user_timeline.json';
	var PUBLIC_TIMELINE_URL = 'http://twitter.com/statuses/public_timeline.json';
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
		var reqUrl = SEARCH_URL + "?q=" + term + "&callback=?";
		for ( var key in data) {
			if (key == 'geocode'){
                            reqUrl += '&gecode='+data.geocode.lat+'%2C'+data.geocode.lon+'%2C'+data.geocode.radius;
                        }else{
			    reqUrl += "&" + key + "=" + data[key];
                        }
		} 
		return reqUrl;
	}
	
	try {
		jQuery.twitter = {};
                jQuery.twitter.public_timeline = function(callback){
                   var reqUrl = PUBLIC_TIMELINE_URL + "?callback=?";
                   $.getJSON(reqUrl, callback);
                };
                jQuery.twitter.trends = function(report, date, callabck){
                    var reqUrl = TRENDS_URL+report+'.json?callback=?';
                    if(jQuery.isFunction(date)){
                            callback = date;
                    }else{
                        reqUrl += '&date='+date;
                    }
                    jQuery.getJSON(reqUrl, callback);
                };
                $(['current', 'daily', 'weekly']).each(function(){
                        var type = this;
                        jQuery.twitter[this] = function(callback){jQuery.twitter.trends(type, callback);};
                });
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
