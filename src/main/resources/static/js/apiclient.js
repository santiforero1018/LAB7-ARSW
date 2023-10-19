apiclient =(function(){
    
    const apiUrl = "/API-V1.0Blueprints";
    
    return {
        getBlueprintsByAuthor: function (authname) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: apiUrl + "/"+authname,
                    type: 'GET',
                    success: function(data){
                        resolve(data);
                    },
                    error: function(error){
                        reject("Error al obtener Blueprints");
                    }
                });
            });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            $.get(apiUrl+'/'+authname+'/'+bpname, function(data){
                callback(data);
            });
        }
    }
})();