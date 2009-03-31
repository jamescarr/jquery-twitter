function __GLOBAL_TWITTER_RESULT_CALLBACK (resp){
        var event = jQuery.Event('stwitter_resultsRecvd');
        event.results = resp;
        jQuery.event.trigger(event);        
}
(function(){
        var searchUrl = "http://search.twitter.com/search.json";
        
        try{
            jQuery.searchTwitter = function(term, data, callback){
            var reqUrl = searchUrl + "?q="+term + "&callback=__GLOBAL_TWITTER_RESULT_CALLBACK";
            if(jQuery.isFunction(data)){
                callback = data;
            };
                        jQuery().bind('stwitter_resultsRecvd', callback);        
                        jQuery.event.trigger('stwitter_searchSubmit', {'url': reqUrl});
                        jQuery('head').append('<script type="text/javascript" src="'+reqUrl+'"></script>');

               };
        }catch(e){
                throw new Exception('jQuery is not defined!');
        }
})();
