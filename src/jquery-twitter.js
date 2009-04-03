
( function() {
	var searches = {};
	var cache = {};
	var SEARCH_URL = "http://search.twitter.com/search.json";
        var TRENDS_URL = "http://search.twitter.com/trends/";
	var USER_TIMELINE_URL = 'http://twitter.com/statuses/user_timeline.json';
	var PUBLIC_TIMELINE_URL = 'http://twitter.com/statuses/public_timeline.json';
        var SPECIFIC_TWEET_URL = 'http://twitter.com/statuses/show/%id%.json';
	function Controller(){
		this.handler = null;
		this.paused = false;
	}
	Controller.prototype.stop = function(){
		clearInterval(this.handler);
	};

	try {
		jQuery.twitter = {
                        show_status: function(id, callback){
                           var url = SPECIFIC_TWEET_URL.replace('%id%', id)+'?callback=?';

                           $.getJSON(url, callback);
                        },

			user_timeline: function(user, data, callback){
                    		var url = USER_TIMELINE_URL + '?screen_name='+user+'&callback=?';
                                if(jQuery.isFunction(data)){
                                    callback = data;
                                }else{
                                    for(var k in data){
                                        url += '&'+k+'='+data[k];
                                    }
                                }
		                    $.getJSON(url, callback);
	                },
			public_timeline: function(callback){
				var reqUrl = PUBLIC_TIMELINE_URL + "?callback=?";
				$.getJSON(reqUrl, callback);
			},
			trends: function(report, date, callabck){
				var reqUrl = TRENDS_URL+report+'.json?callback=?';
				if(jQuery.isFunction(date)){
					callback = date;
				}else{
					reqUrl += '&date='+date;
				}
				jQuery.getJSON(reqUrl, callback);
			},
			liveSearch: function(term, data, callback){
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
				}, 2000);
			},
			search: function(term, data, callback) {
				if (jQuery.isFunction(data)) {
					callback = data;
					data = {};
				}
				jQuery.getJSON(buildSearchUrl(term, data), callback);
			}
		};
                $(['current', 'daily', 'weekly']).each(function(){
                        var type = this;
                        jQuery.twitter[this] = function(callback){jQuery.twitter.trends(type, callback);};
                });

	} catch (e) {
		throw new Exception('jQuery is not defined!');
	}

	function buildSearchUrl(term, data){
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
})();
