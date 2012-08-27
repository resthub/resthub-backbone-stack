define(['underscore', 'backbone', 'pubsub'], function (_, Backbone, PubSub) {

    // Backbone.View extension
    // -----------------------

    var originalPrototype = Backbone.View.prototype;
    var originalDelegateEvents = originalPrototype.delegateEvents;
    var originalUndelegateEvents = originalPrototype.undelegateEvents;
    var originalConstructor = Backbone.View;
    var originalExtend = Backbone.View.extend;

    Backbone.View = function (options) {
        originalConstructor.apply(this, arguments);
    };


    // Restore original prototype
    Backbone.View.prototype = originalPrototype;
    Backbone.View.extend = originalExtend;

    // extend **Backbone.View** properties and methods.
    _.extend(Backbone.View.prototype, {

        globalEventsIdentifier:'!',

        // Override Backbone delegateEvents() method
        // to add support of global events declarations :
        //
        // *{"!event": "callback"}*
        //
        //     {
        //       // regular backbone events
        //       'mousedown .title':  'edit',
        //       'click .button':     'save',
        //       // global events support
        //       '!viewCreated': 'onCreate',
        //       '!viewChanged': 'onChange',
        //       '!viewDeleted': function(e) { ... }
        //     }
        //
        delegateEvents:function (events) {

            originalDelegateEvents.call(this, events);

            if (!(events || (events = getValue(this, 'events')))) return;
            _.each(events, _.bind(function (method, key) {
                if (key.indexOf(this.globalEventsIdentifier) != 0) return;
                if (!_.isFunction(method)) method = this[method];
                if (!method) throw new Error('Method "' + key + '" does not exist');
                PubSub.on(key, method, this);
            }, this));
        },

        undelegateEvents:function () {
            PubSub.off(null, null, this);
            originalUndelegateEvents.call(this);
        }

    });

    // Cached regex to split keys for `delegate`.
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    // Helper function to get a value from a Backbone object as a property
    // or as a function.
    var getValue = function (object, prop) {
        if (!(object && object[prop])) return null;
        return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };

    return Backbone;
});