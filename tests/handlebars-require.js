require(['hbs!../tests/templates/template1.html'], function (template1) {

    module('handlebars-require');

    test('Handlebars require plugin', function () {
        ok(template1, "Template exists and is not undefined");
        equal(template1({value: 'test'}), 'This is a test');
    });

});