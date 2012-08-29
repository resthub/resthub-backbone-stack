define(['underscore', 'backbone', 'pubsub', 'resthub/jquery-event-destroyed'], function (_, Backbone, PubSub) {

    // Backbone.View extension
    // -----------------------

    var originalPrototype = Backbone.View.prototype;
    var originalDelegateEvents = originalPrototype.delegateEvents;
    var originalUndelegateEvents = originalPrototype.undelegateEvents;
    var originalSetElement = originalPrototype.setElement;
    var originalRemove = originalPrototype.remove;
    var originalDispose = originalPrototype.dispose;
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
        },

        // Override backbone setElement to bind a destroyed special event
        // when el is detached from DOM
        setElement:function (element, delegate) {
            originalSetElement.call(this, element, delegate);

            var self = this;
            // call backbone dispose method on el DOM removing
            this.$el.on("destroyed", function () {
                self.dispose();
            });

            return this;
        },

        // Override Backbone method unbind destroyed special event
        // after remove : this prevents dispose to be called twice
        remove:function () {
            this.$el.off("destroyed");
            originalRemove.call(this);
            var self = this;
            // call backbone dispose method on el DOM removing
            this.$el.on("destroyed", function () {
                self.dispose();
            });
        },

        // Override Backbone dispose method to unbind Backbone Validation
        // Bindings if defined
        dispose:function () {
            originalDispose.call(this);

            if (Backbone.Validation) {
                Backbone.Validation.unbind(this)
            }

            return this;
        },

        // utility method providing a default and basic handler that
        // populate model from a form input
        refreshModel:function (form, model) {
            var attributes = {};

            form = form || this.$el.find("form");
            form = form instanceof Backbone.$ ? form : this.$el.find((Backbone.$(form)));
            form = form.find("input[type!='submit']");

            if (arguments.length < 2) model = this.model;

            // build array of form attributes to refresh model
            form.each(_.bind(function (index, value) {
                attributes[value.name] = value.value;
                if (model) {
                    model.set(value.name, value.value);
                }
            }, this));
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