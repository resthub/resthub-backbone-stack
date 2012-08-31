define(['handlebars'], function(Handlebars) {

    var load = function(name, req, load, config) {
        req([("text!" + name)],
            function(templateContent) {
                template = Handlebars.compile(templateContent);
                load(template);
            }
        );
    };

    return {
        load: load
    };

});
