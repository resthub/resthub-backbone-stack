/**
 * Set of generic handlebars helpers
 */
define(['handlebars', 'underscore.string'], function (Handlebars, _s) {
    /**
     * This helper provides a more fluent syntax for inline ifs. i.e. if
     * embedded in quoted strings
     *
     * As with Handlebars 'if', if its first argument returns false, undefined,
     * null or [] (a "falsy" value), '' is returned, otherwise returnVal
     * argument is rendered.
     *
     * Usage: class='{{ifinline done "done"}}'
     *
     */
    Handlebars.registerHelper('ifinline', function (value, returnVal) {
        return (value && !Handlebars.Utils.isEmpty(value)) ? returnVal : '';
    });

    /**
     * Opposite of ifinline helper
     *
     * As with Handlebars 'unless', if its first argument returns false, undefined,
     * null or [] (a "falsy" value), '' returnVal argument is returned, otherwise ''
     * is rendered.
     *
     * Usage: class='{{unlessinline done "todo"}}'
     */
    Handlebars.registerHelper('unlessinline', function (value, returnVal) {
        return (value && !Handlebars.Utils.isEmpty(value)) ? '' : returnVal;
    });

    /**
     * This helper provides a if inline comparing two values.
     *
     * If the two values are strictly equals ('===') return the returnValue
     * argument, '' otherwise.
     *
     * Usage: class='{{ifequalsinline id 1 "active"}}'
     */
    Handlebars.registerHelper('ifequalsinline', function (value1, value2, returnVal) {
        return (value1 === value2) ? returnVal : '';
    });

    /**
     * Opposite of ifequalsinline helper
     *
     * If the two values are not strictly equals ('!==') return the returnValue
     * argument, '' otherwise.
     *
     * Usage: class='{{unlessequalsinline id 1 "disabled"}}'
     */
    Handlebars.registerHelper('unlessequalsinline', function (value1, value2, returnVal) {
        return (value1 === value2) ? '' : returnVal;
    });

    /**
     * This helper provides a if comparing two values
     *
     * If only the two values are strictly equals ('===') display the block
     *
     * Usage:
     *        {{#ifequals type "details"}}
     *            <span>This is details page</span>
     *        {{/ifequals}}
     */
    Handlebars.registerHelper('ifequals', function (value1, value2, options) {

        if (value1 === value2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /**
     * Opposite of ifequals helper
     *
     * If only the two values are not strictly equals ('!==') display the block
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
     * start and end parameters have to be integers >= 0 or their
     * string representation. start should be <= end.
     * In all other cases, the block is not rendered.
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
        var isStartValid = (start != undefined && !isNaN(parseInt(start)) && start >= 0);
        var isEndValid = (end != undefined && !isNaN(parseInt(end)) && end >= 0);
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

    return Handlebars;

});