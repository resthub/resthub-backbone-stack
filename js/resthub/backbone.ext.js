define(['underscore', 'backbone', 'pubsub'], function (_, Backbone, PubSub) {

    // Backbone.View extension
    // -----------------------

    var originalPrototype = Backbone.View.prototype;
    var originalConstructor = Backbone.View;
    var originalExtend = Backbone.View.extend;

    Backbone.View = function () {
        originalConstructor.apply(this, arguments);
        this.subscribeHandles();
    };

    // Restore original prototype
    Backbone.View.prototype = originalPrototype;
    Backbone.View.extend = originalExtend;

    // extend **Backbone.View** properties and methods.
    _.extend(Backbone.View.prototype, {

        // Backbone.PubSub Handles
        // ------------------------

        // Set pubsub subscriptions & handles, where `this.handles` is a hash of
        //
        // *{"type": "callback"}*
        //
        //     {
        //       "viewCreated": "onCreate",
        //       "viewChanged": "onChange"
        //       "viewDeleted": function(e) { ... }
        //     }
        //
        // pairs.
        subscribeHandles:function (handles) {
            if (!(handles || (handles = getValue(this, 'handles')))) return;
            this.unsubscribeHandles();
            for (var type in handles) {
                var callback = handles[key];
                if (!_.isFunction(callback)) callback = this[handles[type]];
                if (!callback) throw new Error('Method "' + handles[type] + '" does not exist');
                callback = _.bind(callback, this);
                this._subscriptions.push(PubSub.subscribe(type, callback));
            }
        },

        unsubscribeHandles: function() {
            _.each(this._subscriptions, function(handle, index){
                PubSub.unsubscribe(handle);
            });

            this._subscriptions = [];
        }

    });

    // Helper function to get a value from a Backbone object as a property
    // or as a function.
    var getValue = function (object, prop) {
        if (!(object && object[prop])) return null;
        return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };

    return Backbone;
});