define(['handlebars'], function (Handlebars) {

    var loadResource = function (resourceName, parentRequire, callback, config) {
        parentRequire([("text!" + resourceName)],
            function (templateContent) {
                var template = Handlebars.compile(templateContent);
                callback(template);
            }
        );
    };

    return {
        load: loadResource
    };

});