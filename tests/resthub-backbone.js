require(['resthub-backbone', 'pubsub'], function (Backbone, PubSub) {

    module('resthub-backbone');

    test('correct inheritance', 4, function () {

        var EmptyView = Backbone.View.extend({});

        var testView = new EmptyView();

        ok(EmptyView.extend, "extend defined");
        ok(testView.el, "el defined");
        ok(testView.render, "render defined");
        ok(testView.subscribeHandles, "subscribeHandle defined");
    });

    test('subscribers recorded', 2, function () {

        var counts = [0, 0];

        var TestView = Backbone.View.extend({
            handles:{
                "type1":"callback1",
                "type2":"callback2"
            },

            callback1:function () {
                counts[0] += 1;
            },

            callback2:function () {
                counts[1] += 1;
            }
        });

        var testView = new TestView();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(counts[0], 1, "callback1 called once and only once");
        equal(counts[1], 1, "callback2 called once and only once");
    });

    test('subscribers multiple views', 2, function () {

        var counts = [0, 0];

        var TestView = Backbone.View.extend({
            handles:{
                "type1":"callback1",
                "type2":"callback2"
            },

            callback1:function () {
                counts[0] += 1;
            },

            callback2:function () {
                counts[1] += 1;
            }
        });

        var testView = new TestView();
        var testView2 = new TestView();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(counts[0], 2, "callback1 called twice");
        equal(counts[1], 2, "callback2 called twice");
    });

    test('subscribers recorded this bound', 1, function () {

        var counts = [0, 0];

        var TestView = Backbone.View.extend({

            bound:true,

            handles:{
                "type1":"callback1"
            },

            callback1:function () {
                if (this.bound) counts[0] += 1;
            }

        });

        var testView = new TestView();

        PubSub.publish("type1");

        equal(counts[0], 1, "this correctly bound");
    });

    test('subscribers recorded with params', 1, function () {

        var counts = [0, 0];

        var TestView = Backbone.View.extend({

            bound:true,

            handles:{
                "type1":"callback1"
            },

            callback1:function (arg1, arg2) {
                if (arg1 === 1 && arg2 === 2) counts[0] += 1;
            }

        });

        var testView = new TestView();

        PubSub.publish("type1", [1, 2]);
        PubSub.publish("type1", [1]);

        equal(counts[0], 1, "params correctly bound");
    });

    test('unsubscribing', 2, function () {

        var counts = [0, 0];

        var TestView = Backbone.View.extend({
            handles:{
                "type1":"callback1",
                "type2":"callback2"
            },

            callback1:function () {
                counts[0] += 1;
            },

            callback2:function () {
                counts[1] += 1;
            }
        });

        var testView = new TestView();
        testView.unsubscribeHandles();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(counts[0], 0, "callback1 never called");
        equal(counts[1], 0, "callback2 never called");
    });

    test('unsubscribing multiple views', 2, function () {

        var counts = [0, 0];

        var TestView = Backbone.View.extend({
            handles:{
                "type1":"callback1",
                "type2":"callback2"
            },

            callback1:function () {
                counts[0] += 1;
            },

            callback2:function () {
                counts[1] += 1;
            }
        });

        var testView = new TestView();
        var testView2 = new TestView();
        testView.unsubscribeHandles();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(counts[0], 1, "callback1 called once and only once");
        equal(counts[1], 1, "callback2 called once and only once");
    });

});