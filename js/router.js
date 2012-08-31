define(['backbone', 'backbone-queryparams'], function(Backbone) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            '*path': 'defaultAction'
        },

        defaultAction: function() {
        }
    });

    return {
        initialize: function() {
            new AppRouter;
            Backbone.history.start({ pushState: true, root: "/" });
        };
    };

});
