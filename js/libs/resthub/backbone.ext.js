define(['underscore', 'backbone-orig', 'pubsub', 'libs/resthub/jquery-event-destroyed'], function(_, Backbone, PubSub) {

    // Backbone.View extension
    // -----------------------

    var originalPrototype        = Backbone.View.prototype;
    var originalDelegateEvents   = originalPrototype.delegateEvents;
    var originalUndelegateEvents = originalPrototype.undelegateEvents;
    var originalSetElement       = originalPrototype.setElement;
    var originalRemove           = originalPrototype.remove;
    var originalDispose          = originalPrototype.dispose;
    var originalConstructor      = Backbone.View;
    var originalExtend           = Backbone.View.extend;

    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'root', 'strategy', 'context'];

    // Restore original prototype
    Backbone.View.prototype = originalPrototype;
    Backbone.View.extend    = originalExtend;

    // extend **Backbone.View** properties and methods.
    _.extend(Backbone.View.prototype, {

        globalEventsIdentifier: '!',

        strategy: 'replace',

        _ensureRoot: function() {
            this.$root = this.root instanceof $ ? this.root : $(this.root);
            if (this.$root.length != 1) {
                throw new Error('Root element "' + this.$root.selector + '" does not exist or is not unique.');
            }
            this.root = this.$root.first();
        },

        _insertRoot: function() {
            var strategy = this.strategy;
            if (strategy == 'replace') {
                strategy = 'html';
            }
            if (_.indexOf(['html', 'append', 'prepend'], strategy) === -1) {
                throw new Error('Invalid strategy "' + strategy + '", must be one of replace, append or prepend.');
            }
            this.$root[strategy](this.el);
        },

        render: function(context) {
            if (!this.template || typeof this.template !== 'function') {
                throw new Error('Invalid template provided.');
            }
            context = this._ensureContext(context);
            this.$el.html(this.template(context));
            return this;
        },

        _ensureContext: function(context) {
            if (!context) {
                if (typeof this.context === 'object') {
                    context = this.context;
                } else {
                    var key = _.find([this.context, 'model', 'collection'], function(key) {
                        return this[key];
                    }, this);
                    context = this[key];
                }
            }
            if (context && context.toJSON) {
                context = context.toJSON();
            }
            // Maybe throw an error if the context could not be determined
            // instead of returning {}
            return context || {};
        },

        _configure: function(options) {
          if (this.options) options = _.extend({}, this.options, options);
          for (var i = 0, l = viewOptions.length; i < l; i++) {
            var attr = viewOptions[i];
            if (options[attr]) this[attr] = options[attr];
          }
          this.options = options;
        },

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
        delegateEvents: function(events) {

            originalDelegateEvents.call(this, events);
            this._eventsSubscriptions = [];

            if (!(events || (events = getValue(this, 'events')))) return;
            _.each(events, _.bind(function(method, key) {
                if (key.indexOf(this.globalEventsIdentifier) != 0) return;
                if (!_.isFunction(method)) method = this[method];
                if (!method) throw new Error('Method "' + key + '" does not exist');
                PubSub.on(key, method, this);
                this._eventsSubscriptions.push(key);
            }, this));
        },

        undelegateEvents: function() {

            if (this._eventsSubscriptions && this._eventsSubscriptions.length > 0) {
                PubSub.off(this._eventsSubscriptions.join(' '), null, this);
            }
            originalUndelegateEvents.call(this);
        },

        // Override backbone setElement to bind a destroyed special event
        // when el is detached from DOM
        setElement: function(element, delegate) {
            originalSetElement.call(this, element, delegate);

            if (this.root) {
                this._ensureRoot();
                this._insertRoot();
            }

            var self = this;
            // call backbone dispose method on el DOM removing
            this.$el.on("destroyed", function() {
                self.dispose();
            });

            return this;
        },

        // Override Backbone method unbind destroyed special event
        // after remove : this prevents dispose to be called twice
        remove: function() {
            this.$el.off("destroyed");
            originalRemove.call(this);
            var self = this;
            // call backbone dispose method on el DOM removing
            this.$el.on("destroyed", function() {
                self.dispose();
            });
        },

        // Override Backbone dispose method to unbind Backbone Validation
        // Bindings if defined
        dispose: function() {

            // perform actions before effective close
            this.onDispose();

            originalDispose.call(this);
            PubSub.off(null, null, this);

            if (Backbone.Validation) {
                Backbone.Validation.unbind(this);
            }

            return this;
        },

        onDispose: function() {
            return this;
        },

        // populate model from a form input
        //
        // form parameter could be a css selector or a jQuery element. if undefined,
        // the first form of this view el is used.
        // if no model instance is provided, search for 'this.model'
        populateModel: function(form, model) {
            var attributes = {};

            form = form || (this.el.tagName === 'FORM' ? this.$el : this.$el.find("form"));
            form = form instanceof Backbone.$ ? form : this.$el.find(form);
            var fields = form.find("input[type!='submit'][type!='button'], textarea, select");

            if (arguments.length < 2) model = this.model;

            // build array of form attributes to refresh model
            fields.each(function() {
                attributes[Backbone.$(this).attr('name')] = Backbone.$(this).val();
            });

            if (model) {
                model.set(attributes);
            }
        }

    });


    // Backbone.History extension
    // --------------------------

    var originalHistPrototype = Backbone.History.prototype;
    var originalStart         = originalHistPrototype.start;

    // extend **Backbone.History** properties and methods.
    _.extend(Backbone.History.prototype, {
        // Override backbone History start to bind intercept a clicks in case of pushstate activated
        // and execute a Backbone.navigate instead of defaults
        start: function(options) {
            var ret = originalStart.call(this, options);

            if (options && options.pushState) {
                // force all links to be handled by Backbone pushstate - no get will be send to server
                $(window.document).on('click', 'a:not([data-bypass])', function(evt) {

                    var protocol = this.protocol + '//';
                    var href = this.href;
                    href = href.slice(protocol.length);
                    href = href.slice(href.indexOf("/") + 1);

                    if (href.slice(protocol.length) !== protocol) {
                        evt.preventDefault();
                        Backbone.history.navigate(href, true);
                    }
                });
            }

            return ret;
        }
    });

    // Helper function to get a value from a Backbone object as a property
    // or as a function.
    var getValue = function(object, prop) {
        if (!(object && object[prop])) return null;
        return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };

    return Backbone;
});
