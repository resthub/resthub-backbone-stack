define(['underscore', 'backbone', 'pubsub', 'lib/resthub/jquery-event-destroyed'], function(_, Backbone, PubSub) {

	  var Resthub = { };

    Resthub.Validation = (function () {

        var ResthubValidation = {};

        // store the list of already synchronized models class names
        var synchronized = [];

        // locale initialization
        var locale = window.navigator.language || window.navigator.userLanguage;

        // is locale changed ?
        var localeChanged;

        ResthubValidation.options = {};

        // server url for the web service exporting validation constraints
        ResthubValidation.options.url = 'api/validation';

        // set to true if we expect only messages keys from server and not localized messages
        ResthubValidation.options.keyOnly = false,

        // regular expression used to validate urls
        ResthubValidation.options.urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/,

        // regular expression used to parse urls
        ResthubValidation.options.urlParser = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,

        // Function to be called by end user once the locale changed on client.
        // set the current locale and a flag
        ResthubValidation.locale = function(loc) {
           locale = loc;
           localeChanged = true;
        };

        // Constructs the array of validation constraints in Backbone Validation format
        // from the response sent by the server for the current model.
        // This method consider an optional messages object containing the custom or localized
        // messages, if any.
        var buildValidation = function (resp, model, messages) {

            // copy existing validation object, if any
            var validation = _.clone(model.prototype.validation) || {};

            for (var propKey in resp.constraints) {

                // ignore property if already defined in client model
                if (validation[propKey]) continue;

                // manage eventual inclusions and exclusions
                if (model.prototype.excludes && _.indexOf(model.prototype.excludes, propKey) != -1) {
                    continue;
                } else if (model.prototype.includes && _.indexOf(model.prototype.includes, propKey) == -1) {
                    continue;
                }

                var prop = [];
                var constraints = resp.constraints[propKey];
                var constraint;
                var required = null;

                for (var idx in constraints) {
                    constraint = null;
                    var currentConstraint = constraints[idx];
                    // replace returned message by the client custom provided message, if any
                    constraints[idx].message = ResthubValidation.constraintMessage(propKey, currentConstraint, messages);

                    // get the validator for the current constraint type
                    // and execute callback if defined.
                    // provides a concrete Backbone Validation constraint
                    var validator = validators[currentConstraint.type];
                    if (validator) {
                        constraint = validator(currentConstraint);
                    }

                    if (constraint) {
                        // is the current constraint contains a requirement to true ?
                        if (constraint.required) required = constraint.required;
                        prop.push(constraint);
                    }
                }

                // Manage requirements because, by default, any expressed constraint in
                // Backbone Validation implies a requirement to true.
                // To manage a constraint with a requirement to false, we add a required false
                // constraint to the current property if no true requirement was originally expressed
                if (!required) {
                    prop.push({required: false});
                }

                validation[propKey] = prop;
            }

            // Set the built validation constraint to the current model but also save the original client
            // validation to be able to rebuild this later (e.g. when the locale changed)
            model.prototype.originalValidation = model.prototype.originalValidation || model.prototype.validation;
            model.prototype.validation = validation;
        };

        // map a constraint type to a concrete validator function
        var validators = {
            'NotNull': function (constraint) {
                return {
                    required: true,
                    msg: constraint.message
                }
            },
            'NotEmpty': function (constraint) {
                return {
                    required: true,
                    msg: constraint.message
                }
            },
            'NotBlank': function (constraint) {
                return {
                    required: true,
                    msg: constraint.message
                }
            },
            'Null': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.nullValidator(value, constraint.message)}
                }
            },
            'AssertTrue': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.assertTrueValidator(value, constraint.message)}
                }
            },
            'AssertFalse': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.assertFalseValidator(value, constraint.message)}
                }
            },
            'Size': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.sizeValidator(value, constraint.min, constraint.max, constraint.message)}
                }
            },
            'Min': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.minValidator(value, constraint.value, constraint.message)}
                }
            },
            'DecimalMin': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.decimalMinValidator(value, constraint.value, constraint.message)}
                }
            },
            'Max': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.maxValidator(value, constraint.value, constraint.message)}
                }
            },
            'DecimalMax': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.decimalMaxValidator(value, constraint.value, constraint.message)}
                }
            },
            'Pattern': function (constraint) {
                return {
                    pattern: constraint.regexp,
                    msg: constraint.message
                }
            },
            'URL': function (constraint) {
                return {
                    fn: function (value) {return ResthubValidation.urlValidator(value, constraint.protocol, constraint.host, constraint.port, constraint.regexp, constraint.message)}
                }
            },
            'Range': function (constraint) {
                return {
                    range: [constraint.min || 0, constraint.max || 0x7fffffffffffffff],
                    msg: constraint.message
                }
            },
            'Length': function (constraint) {
                return {
                    rangeLength: [constraint.min || 0, constraint.max || 0x7fffffff],
                    msg: constraint.message
                }
            },
            'Email': function (constraint) {
                return {
                    pattern: 'email',
                    msg: constraint.message
                }
            },
            'CreditCardNumber': function (constraint) {
                return {
                    pattern: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
                    msg: constraint.message
                }
            }
        };

        // add or replace the validator associated to the given constraintType.
        // validator parameter should be a function
        ResthubValidation.addValidator = function (constraintType, validator) {
            validators[constraintType] = validator;
        };

        // retrieve the validator associated to a given constraint type
        ResthubValidation.getValidator = function (constraintType) {
            return validators[constraintType];
        };

        // retrieves a message key in the client side defined messages map if any
        // returns the value contained in messages map if any (e.g. for localization
        // purposes) or the original message if no data found in messages object
        ResthubValidation.constraintMessage = function (propKey, constraint, messages) {
            var msg = constraint.message;

            if (messages && messages[constraint.message]) {
                msg = messages[constraint.message];

                for (p in constraint) {
                    msg = msg.replace(new RegExp('{'+p+'}', 'g'), constraint[p]);
                }
            }

            return msg;
        };

        ResthubValidation.nullValidator = function (value, msg) {
            if (ResthubValidation.hasValue(value)) {
                return msg;
            }
        };

        ResthubValidation.assertTrueValidator = function (value, msg) {
            if (ResthubValidation.hasValue(value) && (_.isString(value) && value.toLowerCase() != "true")) {
                return msg;
            }
        };

        ResthubValidation.assertFalseValidator = function (value, msg) {
            if (ResthubValidation.hasValue(value) && (_.isString(value) && value.toLowerCase() == "true")) {
                return msg;
            }
        };

        ResthubValidation.minValidator = function (value, min, msg) {
            var numValue = parseInt(value);
            if (ResthubValidation.hasValue(value) && (isNaN(numValue) || (numValue != value) || (numValue < min))) {
                return msg;
            }
        };

        ResthubValidation.maxValidator = function (value, max, msg) {
            var numValue = parseInt(value);
            if (ResthubValidation.hasValue(value) && (isNaN(numValue) || (numValue != value) || (numValue > max))) {
                return msg;
            }
        };

        ResthubValidation.decimalMinValidator = function (value, min, msg) {
            var numValue = parseFloat(value);
            if (ResthubValidation.hasValue(value) && (isNaN(numValue) || (numValue != value) || (numValue < min))) {
                return msg;
            }
        };

        ResthubValidation.decimalMaxValidator = function (value, max, msg) {
            var numValue = parseFloat(value);
            if (ResthubValidation.hasValue(value) && (isNaN(numValue) || (numValue != value) || (numValue > max))) {
                return msg;
            }
        };

        ResthubValidation.sizeValidator = function (value, min, max, msg) {
            if (ResthubValidation.hasValue(value) && ((_.isString(value) || _.isArray(value)) && (value.length < min || value.length > max))) {
                return msg;
            }
        };

        ResthubValidation.urlValidator = function (value, protocol, host, port, regexp, msg) {
            if (!_.isString(value) || !value.match(ResthubValidation.urlPattern)) {
                return msg;
            }
            if (regexp && !value.match(regexp)) {
                return msg;
            }

            var urlParts = value.match(ResthubValidation.urlParser);
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

                // test if a port is defined and if is a valid number
                if (port != -1 && (isNaN (portValue - 0) || (port != portValue))) {
                    return msg;
                }

                if (host && host != hostValue) {
                   return msg;
                }
            }
        };

        // returns true if the value parameter is defined, not null and not empty (in case of a String or an Array)
        ResthubValidation.hasValue = function(value) {
            return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && value === '') || _.isArray(value) && value.length == 0);
        };

        // removes trailing spaces and tabs on a String.
        // use native String trim function if defined.
        ResthubValidation.trim = String.prototype.trim ?
            function(text) {
                return text === null ? '' : String.prototype.trim.call(text);
            } :
            function(text) {
                var trimLeft = /^\s+/,
                    trimRight = /\s+$/;

                return text === null ? '' : text.toString().replace(trimLeft, '').replace(trimRight, '');
            };

        // retrieves validation constraints from server from the given model and considering
        // the client side defined messages
        ResthubValidation.synchronize = function (model, messages) {
            // perform effective synchronization by sending a REST GET request
            // only if the current model was not already synchronized or if the client
            // locale changed
            if (localeChanged || !synchronized[model.prototype.className]) {
                // if any, re-populate validation constraints with original client side
                // expressed constraints (used in case of re-build when the first client
                // side validation array was already overrided)
                if (model.prototype.originalValidation) {
                    model.prototype.validation = model.prototype.originalValidation;
                }

                synchronized[model.prototype.className] = true;

                $.get(ResthubValidation.options.url + '/' + model.prototype.className, {locale:locale, keyOnly:model.prototype.keyOnly || ResthubValidation.options.keyOnly})
                    .success (_.bind(function (resp) {buildValidation(resp, model, messages)}, this));
            }
        }

        return ResthubValidation;

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
