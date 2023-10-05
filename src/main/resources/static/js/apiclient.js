apiclient =(function(){
    
    const apiUrl = "/API-V1.0Blueprints";
    
    return {
        getBlueprintsByAuthor: function (authname, callback) {
            $.get(apiUrl+'/'+authname, function(data){
                callback(data);
            });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            $.get(apiUrl+'/'+authname+'/'+bpname, function(data){
                callback(data);
            });
        }
    }
})();