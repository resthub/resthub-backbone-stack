define(['underscore', 'backbone', 'pubsub', 'lib/resthub/jquery-event-destroyed'], function(_, Backbone, PubSub) {

	var Resthub = { };

    Backbone.ResthubValidation = (function () {

        var synchronized = [];

        var buildValidation = function (resp, model) {
            var validation = {};

            for (var propKey in resp.constraints) {
                if (model.prototype.excludes && _.indexOf(model.prototype.excludes, propKey) != -1) {
                    continue;
                } else if (model.prototype.includes && _.indexOf(model.prototype.includes, propKey) == -1) {
                    continue;
                }
                var prop = [];
                var constraints = resp.constraints[propKey];
                var required = null;

                for (var idx in constraints) {
                    var constraint = mapConstraint(constraints[idx])
                    if (constraint.required) required = constraint.required;
                    prop.push(constraint);
                }

                if (!required) {
                    prop.push({required: false});
                }

                validation[propKey] = prop;
            }

            model.prototype.validation = validation;
            console.log(model.prototype.validation);
        };

        var syncError = function (resp) {};

        var mapConstraint = function (constraint) {
            var prop = {};
            switch(constraint.type) {
                case 'Null' :
                    prop['fn'] = function (value) {return nullValidator(value, constraint.message)};
                    break;
                case 'AssertTrue' :
                    prop['fn'] = function (value) {return assertTrueValidator(value, constraint.message)};
                    break;
                case 'AssertFalse' :
                    prop['fn'] = function (value) {return assertFalseValidator(value, constraint.message)};
                    break;
                case 'Size':
                    prop['fn'] = function (value) {return sizeValidator(value, constraint.min, constraint.max, constraint.message)};
                    break;
                case 'Min':
                case 'DecimalMin':
                    prop['fn'] = function (value) {return minValidator(value, constraint.min, constraint.message)};
                    break;
                case 'Max':
                case 'DecimalMax':
                    prop['fn'] = function (value) {return maxValidator(value, constraint.max, constraint.message)};
                    break;
                case 'Pattern':
                    prop['pattern'] = constraint.regexp;
                    prop['msg'] = constraint.message;
                    break;
                case 'NotNull':
                    prop['required'] = true;
                    prop['msg'] = constraint.message;
                    break;
                case 'URL':
                    prop['fn'] = function (value) {return urlValidator(value, constraint.protocol, constraint.host, constraint.port, constraint.regexp, constraint.message)};
                    break;
                case 'Range':
                    prop['range'] = [constraint.min || 0, constraint.max || 0x7fffffffffffffff];
                    prop['msg'] = constraint.message;
                    break;
                case 'Length':
                    prop['rangeLength'] = [constraint.min || 0, constraint.max || 0x7fffffff];
                    prop['msg'] = constraint.message;
                    break;
                case 'Email':
                    prop['pattern'] = 'email';
                    prop['msg'] = constraint.message;
                    break;
                case 'CreditCardNumber':
                    prop['pattern'] = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
                    prop['msg'] = constraint.message;
                    break;
            }

            return prop;
        };

        var nullValidator = function (value, msg) {
            if (hasValue(value)) {
                return msg;
            }
        };

        var assertTrueValidator = function (value, msg) {
            if (hasValue(value) && (_.isString(value) && value.toLowerCase() != "true")) {
                return msg;
            }
        };

        var assertFalseValidator = function (value, msg) {
            if (hasValue(value) && (_.isString(value) && value.toLowerCase() == "true")) {
                return msg;
            }
        };

        var minValidator = function (value, min, msg) {
            if (hasValue(value) && (!_.isNumber(value) || (value.length < min))) {
                return msg;
            }
        };

        var maxValidator = function (value, max, msg) {
            if (hasValue(value) && (!_.isNumber(value) || (value.length > max))) {
                return msg;
            }
        };

        var sizeValidator = function (value, min, max, msg) {
            if (hasValue(value) && ((_.isString(value) || _.isArray(value)) && (value.length < min || value.length > max))) {
                return msg;
            }
        };

        var urlValidator = function (value, protocol, host, port, regexp, msg) {
            if (!_.isString(value) || !value.match(Backbone.ResthubValidation.urlPattern)) {
                return msg;
            }
            if (regexp && !value.match(regexp)) {
                return msg;
            }

            var urlParts = value.match(Backbone.ResthubValidation.urlParser);
            var protocolValue = urlParts[2];

            if (protocol && protocol != protocolValue) {
                return msg;
            }

            if (host || port != -1) {
                var hostValue = urlParts[4];
                var indexOfPort = hostValue.indexOf(':');
                if (indexOfPort > -1) {
                    var portValue = hostValue.substring(indexOfPort + 1);
                    hostValue = hostValue.substring(0, indexOfPort);
                }

                if (port != -1 && (isNaN (portValue - 0) || (port != portValue))) {
                    return msg;
                }

                if (host && host != hostValue) {
                   return msg;
                }
            }


        };

        var hasValue = function(value) {
            return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && value === '') || _.isArray(value) && value.length == 0);
        };

        var trim = String.prototype.trim ?
            function(text) {
                return text === null ? '' : String.prototype.trim.call(text);
            } :
            function(text) {
                var trimLeft = /^\s+/,
                    trimRight = /\s+$/;

                return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
            };

        return {
            url : 'api/validation',
            urlPattern : /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/,
            urlParser : /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,

            synchronize: function (model) {
                if (!synchronized[model.prototype.className]) {
                    synchronized[model.prototype.className] = true;

                    $.get(this.url+'/' + model.prototype.className)
                        .success (_.bind(function (resp) {buildValidation(resp, model)}, this))
                        .error (_.bind(syncError, this));
                }
            }
        };

    })();

    // extend **Backbone.View** properties and methods.
    Resthub.View = Backbone.View.extend({
        
        resthubViewOptions : ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'root', 'strategy', 'context'],

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
            // If context provided as parameter is undefined or not an object, use this.context attribute
            if ((typeof context === "undefined") || (typeof context !== 'object')) {
                // Dynamic context provided as a function
                if(_.isFunction(this.context)) {
                    context = this.context();
                // Context provided as a context object
                } else if (typeof this.context === 'object') {
                    context = this.context;
                // Else we automatically populate it with a custom property name set in this.context, model property or collection property
                } else context = {};                    
            }
            // If context provided as parameter is a Model or Collection instance, we save it for later use
            if(context instanceof Backbone.Model) {
                var jsonModel = context.toJSON();
                context = {};
            }
            if(context instanceof Backbone.Collection) {
                var jsonCollection = context.toJSON();
                context = {};
            }
            // Add in the context the property named by this.context String, this.model, this.collection and this.labels if they exist.
            _.each([this.context, 'model', 'collection', 'labels'], function(key) {
                 if(typeof this[key] !== "undefined")
                     if (this[key].toJSON) {
                        context[key] = this[key].toJSON();
                    } else {
                        context[key] = this[key];
                    }
                
            }, this);
            // Eventually override default model and collection attribute with the one passed as parameter
            if(context instanceof Backbone.Model) {
                context['model'] = jsonModel;
            }
            if(context instanceof Backbone.Collection) {
                context['collection'] = jsonCollection;
            }
            // Maybe throw an error if the context could not be determined
            // instead of returning {}
            return context;
        },

        _configure: function(options) {
          if (this.options) options = _.extend({}, this.options, options);
          for (var i = 0, l = this.resthubViewOptions.length; i < l; i++) {
            var attr = this.resthubViewOptions[i];
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

            Resthub.View.__super__.delegateEvents.call(this, events);
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
            Resthub.View.__super__.undelegateEvents.call(this);
        },

        // Override backbone setElement to bind a destroyed special event
        // when el is detached from DOM
        setElement: function(element, delegate) {
            Resthub.View.__super__.setElement.call(this, element, delegate);

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
            Resthub.View.__super__.remove.call(this);
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

            Resthub.View.__super__.dispose.call(this);
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
                var $this = Backbone.$(this);
                var name = $this.attr('name');

                // specific test for radio to get only checked option or null is no option checked
                if ($this.is(':radio')) {
                    if ($this.attr('checked')) {
                        attributes[name] = $this.val();
                    } else if (!attributes[name]) {
                        attributes[name] = null;
                    }
                } else if ($this.is(':checkbox')) {
                    if (!attributes[name]) {
                        attributes[name] = null;
                        var checkboxes = form.find("input[type='checkbox'][name='"+name+"']");
                        if (checkboxes.length > 1) {
                            attributes[name] = [];
                        }
                    }
                    if ($this.is(':checked')){
                        if (_.isArray(attributes[name])) {
                            attributes[name].push($this.val());
                        } else {
                            attributes[name] = $this.val();
                        }
                    }
                } else {
                    attributes[name] = $this.val();
                }
            });

            if (model) {
                model.set(attributes, {silent: true});
                model.set({});
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

    return Resthub;
});
