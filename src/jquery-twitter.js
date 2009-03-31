
(function(){
    var searchUrl = "http://search.twitter.com/search.json";
    var specialKeys = ['live'];
    try {
        jQuery.searchTwitter = function(term, data, callback){
            var reqUrl = searchUrl + "?q=" + term + "&callback=?";
            if (jQuery.isFunction(data)) {
                callback = data;
                data = {};
            }
            for(var key in data){
            	if(key != 'live')
            		reqUrl += "&"+key + "=" + data[key];
            }
        

            jQuery().one('stwitter_resultsRecvd', callback);
            jQuery.event.trigger('stwitter_searchSubmit', {'url': reqUrl});
            jQuery.getJSON(reqUrl, function(result){
            	var event = jQuery.Event('stwitter_resultsRecvd');
                event.results = result;
                jQuery.event.trigger(event);
            });
        };
    } 
    catch (e) {
        throw new Exception('jQuery is not defined!');
    }
})();
