require(['pubsub', 'underscore'], function (Pubsub, _) {

    var listeners = [];

    module('pusbub', {
        teardown:function () {
            Pubsub.off();
        },
        setup:function () {
            localStorage.clear();
        }
    });

    test('should publish triggers to all listeners', 2, function () {
        Pubsub.on('test-event', function () {
            ok(true, 'test-event triggered twice');
        }, this);
        Pubsub.on('test-event', function () {
            ok(true, 'test-event triggered twice');
        }, this);

        // When triggering 'myEvent'
        Pubsub.trigger('test-event');


    });

    test('should not publish to other listeners', 1, function () {
        Pubsub.on('test-event', function () {
            ok(true, 'test-event triggered once');
        }, this);
        Pubsub.on('test-event-2', function () {
            ok(true, 'test-event-2 not triggered');
        }, this);

        // When triggering 'myEvent1'
        Pubsub.trigger('test-event');
    });


    test('should publish but prevent unsubscribed listeners', 1, function () {

        var Subscriber1 = function () {
            Pubsub.on('test-unsubscribe', function () {
                ok(false, 'test-event-2 not triggered when unsubscribed');
            }, this);
        };

        var subscriber1 = new Subscriber1();

        var Subscriber2 = function () {
            Pubsub.on('test-unsubscribe', function () {
                ok(true, 'test-event triggered once');
            }, this);
        };

        new Subscriber2();

        // unsubscribe one of the two listeners
        Pubsub.off(null, null, subscriber1);

        // When triggering 'myEvent1'
        Pubsub.trigger('test-unsubscribe');

    });


    test('should publish with data parameters', 2, function () {
        var data1 = "data1",
            data2 = "data2";

        Pubsub.on('test-publish-data', function (o) {
            deepEqual(o, data1, 'listeners get data parameters');
        }, this);

        Pubsub.trigger('test-publish-data', data1);

        Pubsub.on('test-publish-data-multiple', function () {
            var arr = Array.prototype.slice.call(arguments);
            equal(arr.join(' '), 'data1 data2', 'listeners can get a list of parameters too.');
        }, this);

        Pubsub.trigger('test-publish-data-multiple', data1, data2);
    });


    test('should not lost binding', 1, function () {
        var o = {foo:'bar', test:function () {
            deepEqual(this, o, 'this is O !');
        }};
        Pubsub.on('test-binding', $.proxy(o.test, o), this);
        Pubsub.trigger('test-binding');
    });

});