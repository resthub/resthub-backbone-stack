/**
 * Set of generic handlebars helpers
 */
define(['handlebars', 'underscore.string'], function(Handlebars) {
    /**
     * This helper provides a more fluent syntax for inline ifs. i.e. if
     * embedded in quoted strings and provide optional else support
     *
     * Usage: class='{{ifinline done "done"}}' or class='{{ifinline done "done" "todo"}}'
     */
     Handlebars.registerHelper('ifinline', function (value, returnValTrue, options) {
        var returnValFalse = '';
        if(arguments.length == 4) {returnValFalse = options}
        return value ? returnValTrue : returnValFalse;
     });

    /**
     * Opposite of ifinline helper
     *
     * Usage: class='{{unlessinline done "todo"}}'
     */
    Handlebars.registerHelper('unlessinline', function (value, returnVal) {
        return value ? '' : returnVal;
    });

    /**
     * This helper provides a if inline comparing two values and provide optional else support
     *
     * Usage: class='{{ifequalsinline type "details" "active"}}' or class='{{ifequalsinline type "details" "active" "inactive"}}'
     */
    Handlebars.registerHelper('ifequalsinline', function (value1, value2, returnValTrue, options) {
        var returnValFalse = '';
        if(arguments.length == 5) {returnValFalse = options}
        return (value1 === value2) ? returnValTrue : returnValFalse;
    });

    /**
     * Opposite of ifequalsinline helper
     *
     * Usage: class='{{unlessequalsinline type "details" "disabled"}}'
     */
    Handlebars.registerHelper('unlessequalsinline', function (value1, value2, returnVal) {
        return (value1 === value2) ? '' : returnVal;
    });

    /**
     * This helper provides a if comparing two values
     *
     * Usage:
     *        {{#ifequals type "details"}}
     *            <span>This is details page</span>
     *        {{/ifequals}}
     */
    Handlebars.registerHelper('ifequals', function (value1, value2, options) {

        if (value1 == value2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /**
     * Opposite of ifequals helper
     *
     * Usage:
     *        {{#unlessequals type "details"}}
     *            <span>This is not details page</span>
     *        {{/unlessequals}}
     */
    Handlebars.registerHelper('unlessequals', function (value1, value2, options) {
        var fn = options.fn;
        options.fn = options.inverse;
        options.inverse = fn;

        return Handlebars.helpers['ifequals'].call(this, value1, value2, options);
    });

    /**
     * This helper provides a for i in range loop
     *
     * Usage:
     *        <ul>
     *            {{#for 0 10}}
     *                <li><a href='?page={{this}}'>{{this}}</a></li>
     *            {{/for}}
     *        </ul>
     */
    Handlebars.registerHelper('for', function (start, end, options) {
        var fn = options.fn, inverse = options.inverse;
        var isStartValid = (start && !isNaN(parseInt(start)));
        var isEndValid = (end && !isNaN(parseInt(end)));
        var ret = "";

        if (isStartValid && isEndValid && parseInt(start) <= parseInt(end)) {
            for (var i = start; i <= end; i++) {
                ret = ret + fn(i);
            }
        } else {
            ret = inverse(this);
        }

        return ret;
    });
    
    /**
     * sprintf support, useful for internationalization when used with RequireJS i18n extension
     *
     * Usage: class='{{sprintf "Welcome %s !" username}}'
     */
    Handlebars.registerHelper('sprintf', function () {
        return _.str.sprintf.apply(this, arguments);
    });
    
});