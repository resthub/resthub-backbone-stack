define(['backbone', 'backbone-queryparams'], function(Backbone) {

    var AppRouter = Backbone.Router.extend({
        
        initialize: function() {
            Backbone.history.start({ pushState: true, root: "/" });
        },
        
        routes: {
            '': 'main',
            'test': 'test'
        },
        
        main: function() {
            console.debug("Main route activated");
        },

        test: function() {
            console.debug("Test route activated");
            alert("test");
        }
    });
    
    return AppRouter;

});
