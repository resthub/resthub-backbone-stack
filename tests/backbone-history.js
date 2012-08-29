require(["jquery", "backbone-orig"], function ($, Backbone) {

    var originalHistPrototype = Backbone.History.prototype;

    module("backbone-history", {
        setup:function () {

            _.extend(Backbone.History.prototype, {
                navigate:function () {
                    ok(true, "navigate called");
                }
            });

            Backbone.history = new Backbone.History();

            this.TestView = Backbone.View.extend({

                events:{
                    "click #aTest":"clicked",
                    "click #aTestBypass":"clicked"
                },

                initialize:function () {
                    this.text = '<a id="aTest" href="/test" /><a id="aTest2" href="/test" /><a id="aTestBypass" data-bypass href="/test" />';
                    this.render();
                },

                render:function () {
                    this.$el.html(this.text);
                    $("#qunit-fixture #main").html(this.el);
                },

                clicked:function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.wasClicked = true;
                }
            });
        },
        teardown:function () {
            Backbone.History.prototype = originalHistPrototype;
            Backbone.history.stop();
        }
    });

    test("History start should be defined", 1, function () {
        ok(Backbone.History.prototype.start, "start is defined");
    });

    test("History navigate should not be called when pushState is false", 1, function () {
        var testView = new this.TestView();
        Backbone.history.start();

        QUnit.triggerEvent(testView.$el.find("#aTest").get(0), "click");

        equal(testView.wasClicked, true, "a clicked performed");
    });

    test("History navigate should be called when pushState is true", 2, function () {
        var testView = new this.TestView();
        Backbone.history.start({pushState:true, root:"/"});

        QUnit.triggerEvent(testView.$el.find("#aTest2").get(0), "click");

        equal(testView.wasClicked, undefined, "no click performed");
    });

    test("History navigate should not be called when pushState is true but data bypassed", 1, function () {
        var testView = new this.TestView();
        Backbone.history.start({pushState:true, root:"/"});

        QUnit.triggerEvent(testView.$el.find("#aTestBypass").get(0), "click");

        equal(testView.wasClicked, true, "click performed");
    });
});
