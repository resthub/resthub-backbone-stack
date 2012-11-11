require(['console'], function () {

    module('console', {
        setup: function() {
            console.buffer = [];
        },
        teardown: function() {
        }
    });

    test("'buffer must fill up", function() {
        console.info("An info");
        console.debug("A debug");
        console.warn("A warn");
        console.error("An error");

        equal(console.buffer.length, 4);
    });

    test("'buffer must be empty after sending to server", function() {
        console.BUFFER_MAX_SIZE = 3;

        console.info("An info");
        console.debug("A debug");
        console.warn("A warn");
        equal(console.buffer.length, 0);
    });

    test("'buffer must contains only logs equal or superior to the set level", function() {
        console.level = console.Levels.WARN;

        console.info("An info");
        console.debug("A debug");
        console.warn("A warn");
        console.error("An error");
        equal(console.buffer.length, 2);
    });


});
