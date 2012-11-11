define(['jquery'], function ($) {

// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
    if(typeof(window.console) === 'undefined') {
        window.console = {};
        console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
    }

    var console = window.console;

    // manage IE8 & 9
    var methods = ["log","info","warn","error","assert","dir","clear","profile","profileEnd"];
    if (Function.prototype.bind && console && typeof console.log == "object") {
        methods.forEach(function (method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
    }

    console.buffer = [];
    console.BUFFER_MAX_SIZE = 10;
    // override if needed
    console.serverUrl = "api/logs";

    // Helper to define a logging level object; helps with optimisation.
    var defineLogLevel = function(value, name) {
        return { value: value, name: name };
    };

    var Levels= {};
    Levels.DEBUG = defineLogLevel(1, 'DEBUG');
    Levels.INFO = defineLogLevel(2, 'INFO');
    Levels.WARN = defineLogLevel(4, 'WARN');
    Levels.ERROR = defineLogLevel(8, 'ERROR');
    Levels.OFF = defineLogLevel(99, 'OFF');
    console.Levels = Levels;

    //default level
    console.level = Levels.DEBUG;

    var enabledFor = function (lvl) {
        var filterLevel = console.level;
        return lvl.value >= filterLevel.value;
    };

    var log = console.log;
    var debug = console.debug;
    var info = console.info;
    var warn = console.warn;
    var error = console.error;
    console.log = function () {
        log.apply(this, Array.prototype.slice.call(arguments));
        //sendToServer("error", arguments);
    };
    console.debug = function () {
        debug.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor(Levels.DEBUG)){
            bufferLog("DEBUG", arguments);
        }
    };
    console.info = function () {
        info.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor(Levels.INFO)){
            bufferLog("INFO", arguments);
        }
    };
    console.warn = function () {
        warn.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor(Levels.WARN)){
            bufferLog("WARN", arguments);
        }
    };
    console.error = function () {
        error.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor(Levels.ERROR)){
            bufferLog("ERROR", arguments);
        }
    };

    var bufferLog = function(level, msg){
        var message = typeof msg === "object" ? JSON.stringify(msg) : msg;
        var log = {"level":level, "message": message, "time": new Date()};
        console.buffer.push(log);
        if(console.buffer.length == console.BUFFER_MAX_SIZE){
            // could some logs be lost ?
            sendLogsToServer();
        }
    };

    var sendLogsToServer = function(){
        $.ajax({
            type: 'POST',
            url: console.serverUrl,
            data: JSON.stringify(console.buffer),
            contentType:"application/json",
            success: function(){
                // update log level
            }
        });
        console.buffer = [];
    }

    // on page change/reload send the content of the buffer
    window.onunload = function(){
        sendLogsToServer();
    }

    // manage global JS errors
    window.onerror = function(message, url, linenumber){
        bufferLog("ERROR", "JavaScript error: " + message + " on line " + linenumber + " for " + url);
    }
});