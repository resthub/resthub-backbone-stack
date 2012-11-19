require(["backbone", "pubsub", "resthub"], function(Backbone, pubsub, Resthub) {

    var TYPE5 = "type5";

    module("resthub-backbone-pubsub", {
        setup: function() {
            this.TestView = Resthub.View.extend({

                events: {
                    "click #btn1": "buttonClicked",
                    "click #btn2": "buttonClicked",
                    "!global": "globalFired",
                    "!global1": "globalFired",
                    "!globalParams": "globalFiredParams"
                },

                initialize: function() {
                    this.counts = {};
                    this.setElement("#qunit-fixture #main");
                    this.html = "<button id='btn1' type='button' data-toggle='button'><button id='btn2' type='button' data-toggle='button'>";
                    this.render();
                },

                render: function() {
                    this.$el.html(this.html);
                },

                buttonClicked: function() {
                    this.counts.buttonClicked = (this.counts.buttonClicked || 0) + 1;
                },

                globalFired: function() {
                    this.counts.globalFired = (this.counts.globalFired || 0) + 1;
                },

                globalFiredParams: function(arg1, arg2) {
                    this.counts.globalFiredParams = {};
                    this.counts.globalFiredParams.arg1 = arg1;
                    this.counts.globalFiredParams.arg2 = arg2;
                }
            });

            this.TestView2 = Resthub.View.extend({

                events: {
                    "!global": "globalFired",
                    "!global2": "globalFired",
                    "!globalInline": function() {
                        this.counts.globalInline = (this.counts.globalInline || 0) + 1;
                    }
                },

                initialize: function() {
                    this.counts = {};
                },

                globalFired: function() {
                    this.counts.globalFired = (this.counts.globalFired || 0) + 1;
                }
            });

            this.TestView3 = Resthub.View.extend({

                initialize: function() {
                    this.counts = {};
                    Pubsub.on("!global2", this.global2Fired, this);
                    Pubsub.on("!global3", this.global3Fired, this);
                },

                globalFired: function() {
                    this.counts.globalFired = (this.counts.globalFired || 0) + 1;
                },

                global2Fired: function() {
                    this.counts.global2Fired = (this.counts.global2Fired || 0) + 1;
                },

                global3Fired: function() {
                    this.counts.global3Fired = (this.counts.global3Fired || 0) + 1;
                }
            });
        },
        teardown: function() {
            pubsub.off();
        }
    });

    test("Pubsub should be defined", 3, function() {
        ok(pubsub, "local variable defined");
        ok(window.Pubsub, "global variable defined");
        ok(Pubsub, "global variable defined");
    });

    test("Pubsub correct inheritance", 5, function() {
        ok(pubsub.bind, "pubsub.bind defined");
        ok(pubsub.on, "pubsub.on defined");
        ok(pubsub.off, "pubsub.off defined");
        ok(pubsub.trigger, "pubsub.trigger defined");
        ok(pubsub.unbind, "pubsub.unbind defined");
    });

    test("should trigger regular Backbone events", 2, function() {

        var testView = new this.TestView();

        QUnit.triggerEvent(testView.$el.find("#btn1").get(0), "click");

        equal(testView.counts.buttonClicked, 1, "buttonClicked called once and only once");

        testView.undelegateEvents();
        QUnit.triggerEvent(testView.$el.find("#btn1").get(0), "click");

        equal(testView.counts.buttonClicked, 1, "buttonClicked not called after unbind");
    });

    test("should trigger global events", 2, function() {

        var testView = new this.TestView();

        pubsub.trigger("!global");

        equal(testView.counts.globalFired, 1, "globalFired called once and only once");

        testView.undelegateEvents();

        equal(testView.counts.globalFired, 1, "globalFired not called after unbind");
    });

    test("should trigger global events multiples functions", 2, function() {

        var testView = new this.TestView();

        pubsub.trigger("!global");
        equal(testView.counts.globalFired, 1, "globalFired called once and only once");

        pubsub.trigger("!global1");
        equal(testView.counts.globalFired, 2, "globalFired called once and only once");
    });

    test("should publish global events to all listeners", 2, function() {

        var testView = new this.TestView();
        var testView2 = new this.TestView();

        pubsub.trigger("!global");

        equal(testView.counts.globalFired, 1, "globalFired called on testView");
        equal(testView2.counts.globalFired, 1, "globalFired called on testView2");
    });

    test("should not publish to other listeners", 2, function() {

        var testView = new this.TestView();
        var testView2 = new this.TestView2();

        pubsub.trigger("!global1");

        equal(testView.counts.globalFired, 1, "globalFired called on testView");
        equal(testView2.counts.globalFired, undefined, "globalFired not called on testView2");
    });

    test("should unsubscribe", 2, function() {

        var testView = new this.TestView();

        pubsub.trigger("!global");
        equal(testView.counts.globalFired, 1, "globalFired called once and only once");

        testView.undelegateEvents();

        equal(testView.counts.globalFired, 1, "globalFired not called after unbind");
    });

    test("should unsubscribe callbacks bound twice", 2, function() {

        var testView = new this.TestView();

        pubsub.trigger("!global");
        pubsub.trigger("!global1");
        equal(testView.counts.globalFired, 2, "globalFired called twice");

        testView.undelegateEvents();
        pubsub.trigger("!global");

        equal(testView.counts.globalFired, 2, "globalFired not called after unbind of all");
    });

    test("should publish but prevent unsubscribed listeners", 4, function() {

        var testView = new this.TestView();
        var testView2 = new this.TestView2();

        pubsub.trigger("!global");

        equal(testView.counts.globalFired, 1, "globalFired called on testView");
        equal(testView2.counts.globalFired, 1, "globalFired called on testView2");

        testView.undelegateEvents();
        pubsub.trigger("!global");

        equal(testView.counts.globalFired, 1, "globalFired not called on testView");
        equal(testView2.counts.globalFired, 2, "globalFired called on testView2");

    });

    test("should publish pubsub events declared on initialize", 6, function() {

        var testView = new this.TestView3();

        pubsub.trigger("!global2");
        pubsub.trigger("!global3");

        equal(testView.counts.global2Fired, 1, "global2Fired called on testView");
        equal(testView.counts.global3Fired, 1, "global3Fired called on testView");

        testView.undelegateEvents();

        pubsub.trigger("!global2");
        pubsub.trigger("!global3");

        equal(testView.counts.global2Fired, 2, "global2Fired called on testView");
        equal(testView.counts.global3Fired, 2, "global3Fired called on testView");

        testView.dispose();

        pubsub.trigger("!global2");
        pubsub.trigger("!global3");

        equal(testView.counts.global2Fired, 2, "global2Fired not called on testView");
        equal(testView.counts.global3Fired, 2, "global3Fired not called on testView");

    });

    test("should trigger global events with params", 9, function() {

        var testView = new this.TestView();

        pubsub.trigger("!globalParams");

        ok(testView.counts.globalFiredParams, 1, "globalFiredParams called");
        equal(testView.counts.globalFiredParams.arg1, undefined, "globalFiredParams param1 ok");
        equal(testView.counts.globalFiredParams.arg2, undefined, "globalFiredParams param2 ok");

        pubsub.trigger("!globalParams", "param1");

        ok(testView.counts.globalFiredParams, 1, "globalFiredParams called");
        equal(testView.counts.globalFiredParams.arg1, "param1", "globalFiredParams param1 ok");
        equal(testView.counts.globalFiredParams.arg2, undefined, "globalFiredParams param2 ok");

        pubsub.trigger("!globalParams", "param1", "param2");

        ok(testView.counts.globalFiredParams, 1, "globalFiredParams called");
        equal(testView.counts.globalFiredParams.arg1, "param1", "globalFiredParams param1 ok");
        equal(testView.counts.globalFiredParams.arg2, "param2", "globalFiredParams param2 ok");

    });

    test("should subscribe to one or multiple events", 3, function() {

        var testView3 = new this.TestView3();

        pubsub.trigger("!global");
        equal(testView3.counts.globalFired, undefined, "globalFired never called");

        testView3.delegateEvents({"!global": "globalFired"});
        pubsub.trigger("!global");

        equal(testView3.counts.globalFired, 1, "globalFired called");

        testView3.delegateEvents({"!global1": "globalFired", "!global2": "globalFired"});
        pubsub.trigger("!global1 !global2");

        equal(testView3.counts.globalFired, 3, "globalFired called");
    });

    test("should execute an inline function callback", 1, function() {

        var testView = new this.TestView2();

        pubsub.trigger("!globalInline");

        equal(testView.counts.globalInline, 1, "globalInline called once and only once");
    });

    test("should throw error", 1, function() {

        var ErrorView = Backbone.View.extend({

            events: {
                "!error": "notFoundCallback"
            }
        });

        throws(function() {
            ErrorView();
        }, Error, "Must throw error to pass.");
    });

});
