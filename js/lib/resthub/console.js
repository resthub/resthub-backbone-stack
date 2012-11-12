define(['jquery'], function ($) {

// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
    if(typeof(window.console) === 'undefined') {
        window.console = {};
        console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
    }

    var console = window.console;

    // manage IE8 & 9
    var methods = ['log','info','warn','error','assert','dir','clear','profile','profileEnd'];
    if (Function.prototype.bind && console && typeof console.log === 'object') {
        methods.forEach(function (method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
    }

    // Can be customized if needed
    console.serverUrl = 'api/log';
    console.levels = ['debug', 'info', 'warn', 'error'];
    // Disabled by default
    console.level = 'off';
    
    var enabledFor = function (level) {
        if(console.level === 'off') return false;
        if (_.indexOf(console.levels, level) === -1) {
            throw new Error('Invalid log level "' + strategy + '", must be one of ' + JSON.stringify(console.levels));
        }
        if (_.indexOf(console.levels, console.level) === -1) {
            throw new Error('Invalid log console.level "' + strategy + '", must be one of ' + JSON.stringify(console.levels));
        }
        return _.indexOf(console.levels, level) >= _.indexOf(console.levels, console.level);
    };

    var log = console.log;
    var debug = console.debug;
    var info = console.info;
    var warn = console.warn;
    var error = console.error;
    
    // console.log = console.debug
    console.log = function () {
        log.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor('debug')){
            sendLogToServer('debug', arguments);
        }
    };
    console.debug = function () {
        debug.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor('debug')){
            sendLogToServer('debug', arguments);
        }
    };
    console.info = function () {
        info.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor('info')){
            sendLogToServer('info', arguments);
        }
    };
    console.warn = function () {
        warn.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor('warn')){
            sendLogToServer('warn', arguments);
        }
    };
    console.error = function () {
        error.apply(this, Array.prototype.slice.call(arguments));
        if(enabledFor('error')){
            sendLogToServer('error', arguments);
        }
    };


    var sendLogToServer = function(level, msg){
        if((typeof msg === 'object') && (msg.length === 1) && (typeof msg[0] === 'string')){
            var message = msg[0];
        } else {
            var message = JSON.stringify(msg);
        }

        var log = {'level':level, 'message': message, 'time': new Date()};
        
        $.ajax({
            type: 'POST',
            url: console.serverUrl,
            data: JSON.stringify(log),
            contentType:'application/json',
            success: function(){
                // update log level
            }
        });
    };

    // manage global JS errors
    window.onerror = function(message, url, linenumber){
        sendLogToServer('error', 'JavaScript error: ' + message + ' on line ' + linenumber + ' for ' + url);
    };
});