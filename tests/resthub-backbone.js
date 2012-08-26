require(['resthub-backbone', 'pubsub'], function (Backbone, PubSub) {

    var TYPE5 = "type5";

    module('resthub-backbone', {
        setup:function () {
            this.TestView = Backbone.View.extend({

                handles:[
                    ["type1", "callback1"],
                    ["type2", "callback2"],
                    ["type3", "callback3"],
                    ["type4", "callback4"],
                    [TYPE5, "callback5"],
                    ["type6", function () {
                        this.counts[5] += 1;
                    }]
                ],

                initialize:function () {
                    this.counts = [0, 0, 0, 0, 0, 0];
                    this.bound = true;
                },

                callback1:function () {
                    this.counts[0] += 1;
                },

                callback2:function () {
                    this.counts[1] += 1;
                },

                callback3:function () {
                    if (this.bound) this.counts[2] += 1;
                },

                callback4:function (arg1, arg2) {
                    if (arg1 === 1 && arg2 === 2) this.counts[3] += 1;
                },

                callback5:function () {
                    this.counts[4] += 1;
                }
            });
        }
    });

    test('correct inheritance', 4, function () {

        var EmptyView = Backbone.View.extend({});

        var testView = new EmptyView();

        ok(EmptyView.extend, "extend defined");
        ok(testView.el, "el defined");
        ok(testView.render, "render defined");
        ok(testView.subscribeHandles, "subscribeHandle defined");
    });

    test('subscribers recorded', 2, function () {

        var testView = new this.TestView();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(testView.counts[0], 1, "callback1 called once and only once");
        equal(testView.counts[1], 1, "callback2 called once and only once");

        testView.unsubscribeHandles();
    });

    test('subscribers multiple views', 4, function () {

        var testView = new this.TestView();
        var testView2 = new this.TestView();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(testView.counts[0], 1, "testView callback1 called once");
        equal(testView.counts[1], 1, "testView callback2 called once");
        equal(testView2.counts[0], 1, "testView2 callback1 called once");
        equal(testView2.counts[1], 1, "testView2 callback2 called once");

        testView.unsubscribeHandles();
        testView2.unsubscribeHandles();
    });

    test('subscribers recorded this bound', 1, function () {

        var testView = new this.TestView();

        PubSub.publish("type3");

        equal(testView.counts[2], 1, "this correctly bound");

        testView.unsubscribeHandles();
    });

    test('subscribers recorded with params', 1, function () {

        var testView = new this.TestView();

        PubSub.publish("type4", [1, 2]);
        PubSub.publish("type4", [1]);

        equal(testView.counts[3], 1, "params correctly bound");
    });

    test('subscribers recorded var', 1, function () {

        var testView = new this.TestView();

        PubSub.publish(TYPE5);

        equal(testView.counts[4], 1, "callback5 called once and only once");

        testView.unsubscribeHandles();
    });

    test('subscribers recorded inline func', 1, function () {

        var testView = new this.TestView();

        PubSub.publish("type6");

        equal(testView.counts[5], 1, "callback6 called once and only once");

        testView.unsubscribeHandles();
    });

    test('subscribers recorded func bound', 1, function () {

        var testView = new this.TestView();

        PubSub.publish("type6");

        equal(testView.counts[5], 1, "callback6 called once and only once");

        testView.unsubscribeHandles();
    });

    test('error management', 1, function () {

        var ErrorView = Backbone.View.extend({

            handles:[
                ["type", "callback"]
            ]
        });

        throws(function () {
            ErrorView();
            }, Error, "Must throw error to pass.");

        PubSub.publish("type");
    });

    test('unsubscribing', 2, function () {

        var testView = new this.TestView();
        testView.unsubscribeHandles();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(testView.counts[0], 0, "callback1 never called");
        equal(testView.counts[1], 0, "callback2 never called");
    });

    test('unsubscribing multiple views', 4, function () {

        var testView = new this.TestView();
        var testView2 = new this.TestView();
        testView.unsubscribeHandles();

        PubSub.publish("type1");
        PubSub.publish("type2")

        equal(testView.counts[0], 0, "testView callback1 never called");
        equal(testView.counts[1], 0, "testView callback2 never called");
        equal(testView2.counts[0], 1, "testView2 callback1 called once");
        equal(testView2.counts[1], 1, "testView2 callback2 called once");
    });

})
;