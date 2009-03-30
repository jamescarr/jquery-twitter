function __GLOBAL_TWITTER_RESULT_CALLBACK (resp){
        jQuery.events.trigger('stwitter_resultsRecvd', {results: resp});        
}
function(){
        var searchUrl = "http://search.twitter.com/search.json";
        
        try{
                jQuery.searchTwitter = function(term, data, callback){
                        var reqUrl = searchUrl + "?q="+term + "&callback=__GLOBAL_TWITTER_RESULT_CALLBACK";
                        if(jQuery.isFunction(data){
                                callback = data;
                        };
                        jQuery().bind('stwitter_resultsRecvd', callback);        
                        jQuery.events.trigger('stwitter_searchSubmit', {url: reqUrl});
                        jQuery('head').append('<script type="text/javascript" src="'+url+'"></script>');

                };
        }catch(e){
                throw new Exception('jQuery is not defined!');
        }
});
