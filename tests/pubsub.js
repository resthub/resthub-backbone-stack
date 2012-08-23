require(['pubsub'], function(Pubsub) {
    	
	var listeners = [];
	
	module('pusbub', {
		teardown: function() {
			$.each(listeners, function(i, listener) {
				Pubsub.unsubscribe(listener);
			});
			
			listeners  = [];
		},
		setup: function() {
			localStorage.clear();
		}
	});

	test('should publish triggers to all listeners', function() {
		listeners.push(Pubsub.subscribe('test-event', function () {
			ok(true, 'test-event triggered twice');
		}));
		listeners.push(Pubsub.subscribe('test-event', function () {
			ok(true, 'test-event triggered twice');
		}));

		// When triggering 'myEvent'
		Pubsub.publish('test-event');
		
		
	});
	
	test('should not publish to other listeners', 1, function() {
		listeners.push(Pubsub.subscribe('test-event', function () {
			ok(true, 'test-event triggered twice');
		}));
		listeners.push(Pubsub.subscribe('test-event-2', function () {
			ok(true, 'test-event-2 triggered twice');
		}));

		// When triggering 'myEvent1'
		Pubsub.publish('test-event');
	});
	
	
	test('should publish but prevent unsubscribed listeners', 1, function() {
		var guid = Pubsub.subscribe('test-unsuscribe', function () {
			ok(false, 'test-event-2 not triggered when unsubscribed');
		});
		
		listeners.push(Pubsub.subscribe('test-unsuscribe', function () {
			ok(true, 'test-event triggered twice');
		}));
		
		// unscribe one of the two listeners
		Pubsub.unsubscribe(guid);
		
		// When triggering 'myEvent1'
		Pubsub.publish('test-unsuscribe');
		
	});
	
	
	test('should publish with data parameters', function() {		
		var data = {should: 'be', good: 'enough'},
		arr = ['should', 'be', 'good', 'enough'];
		
		listeners.push(Pubsub.subscribe('test-publish-data', function(o) {
			deepEqual(o, data, 'listeners get data parameters');
		}));
		
		Pubsub.publish('test-publish-data', [data]);
		
		listeners.push(Pubsub.subscribe('test-publish-data-mutliple', function() {
			var arr = Array.prototype.slice.call(arguments);			
			equal(arr.join(' '), 'should be good enough', 'listeners can get a list of parameters too.');
		}));


		Pubsub.publish('test-publish-data-mutliple', arr);
	});
	
	
	test('should not lost binding', 1, function() {
		var o = {foo: 'bar', test: function() { deepEqual(this, o, 'this is O !'); }};
		listeners.push(Pubsub.subscribe('test-binding', $.proxy(o.test, o)));
		Pubsub.publish('test-binding');
	});
		
});