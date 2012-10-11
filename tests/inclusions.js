/**
 * Author: Baptiste Meurant <baptiste.meurant@gmail.com>
 * Date: 24/08/12
 * Time: 11:26
 */

require(['async'], function() {

    module('async');

    test('async inclusion', function() {
        ok(async, "async exists and is not undefined");
    });
});

require(['backbone'], function(Backbone) {

    module('backbone');

    test('backbone inclusion', function() {
        ok(Backbone, "backbone exists and is not undefined");
        ok(Backbone.ResthubView, "backbone resthub view exists and is not undefined");
    });
});

require(['backbone-validation'], function(BackboneValidation) {

    module('backbone-validation');

    test('backbone-validation inclusion', function() {
        ok(BackboneValidation, "backbone-validation exists and is not undefined");
    });
});

require(['backbone-paginator'], function(BackbonePaginator) {

    module('backbone-paginator');

    test('backbone-paginator inclusion', function() {
        ok(BackbonePaginator, "backbone-paginator exists and is not undefined");
    });
});

require(['backbone', 'backbone-queryparams'], function(Backbone) {

    module('backbone-queryparams');

    test('backbone-queryparams inclusion', function() {
        ok(Backbone.History.prototype.getQueryParameters, "backbone-queryparams exists and is not undefined");
    });
});

require(['keymaster'], function() {

    module('keymaster');

    test('keymaster inclusion', function() {
        ok(key, "keymaster exists and is not undefined");
    });
});
