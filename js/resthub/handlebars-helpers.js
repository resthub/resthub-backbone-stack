/**
 * Set of generic handlebars helpers
 *
 * Author: Baptiste Meurant <baptiste.meurant@gmail.com>
 * Date: 23/08/12
 * Time: 12:14
 */

(function (factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('handlebars'));
    } else if (typeof define === 'function' && define.amd) {
        define(['handlebars'], factory);
    }
}(function (Handlebars) {

    /**
     * This helper provides a more fluent syntax for inline ifs. i.e. if
     * embedded in quoted strings
     *
     * Usage: class='{{ifinline done "done"}}'
     */
    Handlebars.registerHelper('ifinline', function (value, returnVal) {
        return value ? returnVal : '';
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
     * This helper provides a if inline comparing two values
     *
     * Usage: class='{{ifequalsinline type "details" "active"}}'
     */
    Handlebars.registerHelper('ifequalsinline', function (value1, value2, returnVal) {
        return (value1 == value2) ? returnVal : '';
    });

    /**
     * Opposite of ifequalsinline helper
     *
     * Usage: class='{{unlessequalsinline type "details" "disabled"}}'
     */
    Handlebars.registerHelper('unlessequalsinline', function (value1, value2, returnVal) {
        return (value1 == value2) ? '' : returnVal;
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
}));