define(['backbone', 'underscore'], function(Backbone, _) {

    var Pubsub = window.Pubsub;

    if (!Pubsub) {
        Pubsub = {};
        _.extend(Pubsub, Backbone.Events);
    }

    return window.Pubsub = Pubsub;

});
