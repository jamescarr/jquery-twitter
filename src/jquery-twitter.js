
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
                jQuery.twitter.trends = function(report, date, callabck){
                    var reqUrl = 'http://search.twitter.com/trends/'+report+'.json';
                    if(jQuery.isFunction(date)){
                            callback = date;
                    }else{
                        reqUrl += '?date='+date;
                    }
                    jQuery.getJSON(reqUrl, callback);
                };
                $(['current', 'daily', 'weekly']).each(function(){
                        var type = this;
                        jQuery.twitter[this] = function(date,callback){jQuery.twitter.trends(type, date, callback);};
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
