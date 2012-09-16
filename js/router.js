define(['backbone', 'backbone-queryparams'], function(Backbone) {

    var AppRouter = Backbone.Router.extend({
        
        initialize: function() {
            Backbone.history.start({ pushState: true, root: "/" });
        },
        
        routes: {
            '*path': 'defaultAction'
        },

        defaultAction: function() {
        }
    });
    
    return AppRouter;

});
