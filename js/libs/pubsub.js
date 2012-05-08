/*
 * RESThub.js publish/subscribe module
 * Implements a simple event bus in order to allow low coupling in you application
 * 
 * Based jQuery Tiny Pub/Sub - v0.3 - 11/4/2010
 * http://benalman.com/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
define(['jquery'], function($) {

	/**
	 * Stores event handlers
	 */
	Pubsub.rootListener = {};

	/**
	 * Define an event handler for this eventType listening on the event bus
	 *
	 * subscribe( type, callback )
	 * @param {String} type A string that identify your custom javaScript event type
	 * @param {function} callback(args) function to execute each time the event is triggered, with
	 * 
	 * @return Handle used to unsubribe.
	 */
	Pubsub.subscribe = function(type, callback) {
		// Creates an event source
		var listener = $({});
		// Binds the callback to the eventsource
		listener.bind(type, function(){
			// Remove the event arguments 
			callback.apply(this, Array.prototype.slice.call(arguments, 1));
		});
		// Creates, stores and returns a handle.
		var handle = ""+parseInt(Math.random()*1000000000);
		Pubsub.rootListener[handle] = listener;
		return handle;
	};

	/**
	 * Remove a previously-defined event handler for the matching eventType
	 * 
	 * @param {String} handle The handle returned by the $.subscribe() function
	 */
	Pubsub.unsubscribe = function(handle) {
		if(handle in Pubsub.rootListener) {
			Pubsub.rootListener[handle].unbind();
			delete(Pubsub.rootListener[handle]);
		}
	};

	/**
	 * Publish an event in the event bus
	 * 
	 * @param {String} type A string that identify your custom javaScript event type
	 * @param {Array} data  Parameters to pass along to the event handler
	 */
	Pubsub.publish = function(type, data) {
		for(var handle in Pubsub.rootListener) {
			Pubsub.rootListener[handle].trigger(type, data);
		}
	};

	return Pubsub;

});