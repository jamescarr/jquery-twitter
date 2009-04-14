
( function() {
	var SEARCH_URL = "http://search.twitter.com/search.json";
	var TRENDS_URL = "http://search.twitter.com/trends/";
	var USER_TIMELINE_URL = 'http://twitter.com/statuses/user_timeline.json';
	var PUBLIC_TIMELINE_URL = 'http://twitter.com/statuses/public_timeline.json';
	var SPECIFIC_TWEET_URL = 'http://twitter.com/statuses/show/%id%.json';
	
	function TwitterStream(name, callback, data, method){
		this.name = name;
		this.searchSpeed = 2000;
		this.paused = false;
		this.handler = null;
		this.callback = callback;
		this.data = data;
		this.method = method;
    this.getSinceId = function(str){
      if(str.indexOf('since_id') > -1)
        return str.match(/since_id=(.+)&/)[1];
    };
	}  
	TwitterStream.prototype.stop = function(){
		clearInterval(this.handler);
	};
	TwitterStream.prototype.start = function(){	
		var self = this;
		this.handler = setInterval(function(){
			if(self.paused)return;
      
			jQuery.twitter[self.method](self.term, self.data, function(resp){
				var results = resp.results;
        self.data.since_id = self.getSinceId(resp.refresh_url);
        
				if(results.length > 0){
					self.callback.call(self, resp);
				}
			});
		}, self.searchSpeed);
	}
	// bind events
	var toggleStream = function(pause){
		return function(e){
			var control = jQuery.twitter.streams[e.channel];
			if(control)
				control.paused = pause;
			return false;
		};
	};
	var toggleAllStreams = function(pause){
		return function(){
			jQuery(jQuery.twitter.streams).each(function(){
				this.paused = pause;
			});
		};
	}
	jQuery().bind('twitter:pause_all', toggleAllStreams(true));
	jQuery().bind('twitter:play_all', toggleAllStreams(false));
	jQuery().bind('twitter:pause', toggleStream(true));
	jQuery().bind('twitter:play', toggleStream(false));
	jQuery().bind('twitter:adjust_speed', function(e){
		var stream = jQuery.twitter.streams[e.term];
		if(stream){
			stream.stop();
			stream.searchSpeed = e.speed;
			stream.start();
		}			
	});
	$().bind('twitter:change_search', function(e){
		var stream = jQuery.twitter.streams[e.channel]
		stream.stop();
		stream.term = e.term;
		stream.start();
	});
	try {
		jQuery.twitter = {
			streams:{},
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
			live_public_timeline: function(callback){
				jQuery.twitter.streams['public'] = new TwitterStream('', callback, {}, 'public_timeline');
				jQuery.twitter.streams['public'].start();
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
				var channel = data.channel_name? data.channel_name : term;
				jQuery.twitter.streams[channel] = new TwitterStream(channel, callback, data, 'search');
				jQuery.twitter.streams[channel].term = term;
				jQuery.twitter.streams[channel].start();
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
            jQuery.twitter[type] = function(callback){
				jQuery.twitter.trends(type, callback);
			};
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
