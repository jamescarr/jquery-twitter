function __GLOBAL_TWITTER_RESULT_CALLBACK (resp){
        jQuery.events.trigger('stwitter_resultsRecvd', {results: resp});        
}
function(){
        var searchUrl = "http://search.twitter.com/search.json";
        
        try{
                jQuery.searchTwitter = function(term, data, callback){
                        var reqUrl = searchUrl + "?q="+term;
                        if(jQuery.isFunction(data){
                                callback = data;
                        };
                        jQuery().bind('stwitter_resultsRecvd', callback);        
                        jQuery.events.trigger('stwitter_searchSubmit', {url: reqUrl});

                };
        }catch(e){
                throw new Exception('jQuery is not defined!');
        }
});
