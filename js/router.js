define(['backbone', 'backbone-queryparams'], function(Backbone) {

    var AppRouter = Backbone.Router.extend({
        
        initialize: function() {
            Backbone.history.start();
        },
        
        routes: {
            'test': 'test'
        },

        test: function() {
            alert("test");
        }
    });
    
    return AppRouter;

});
