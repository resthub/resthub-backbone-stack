// Set the require.js configuration for your application.
require.config({
    baseUrl: '../js',
    shim: {
        'underscore': {
            exports: '_'
        },
        'underscore.string': {
            deps: [
                'underscore'
            ]
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'backbone-orig': {
            deps: [
                'underscore',
                'underscore.string',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'backbone-queryparams': {
            deps: [
                'backbone-orig',
                'underscore'
            ]
        },
        'backbone-paginator': {
            deps: [
                'backbone-orig',
                'underscore',
                'jquery'
            ],
            exports: 'Backbone.Paginator'
        }
    },

    // Libraries
    paths: {
        jquery: 'libs/jquery',
        underscore: 'libs/underscore',
        'underscore.string': 'libs/underscore.string',
        'backbone-orig': 'libs/backbone',
        backbone: 'libs/resthub/backbone.ext',
        localstorage: 'libs/localstorage',
        text: 'libs/text',
        i18n: 'libs/i18n',
        pubsub: 'libs/resthub/pubsub',
        handlebars: 'libs/handlebars',
        'resthub-handlebars': 'libs/resthub/handlebars-helpers',
        async: 'libs/async',
        'backbone-validation': 'libs/backbone-validation',
        'resthub-backbone-validation': 'libs/resthub/backbone-validation.ext',
        'backbone-paginator': 'libs/backbone.paginator',
        'backbone-queryparams': 'libs/backbone.queryparams',
        keymaster: 'libs/keymaster',
        hbs: 'libs/resthub/require-handlebars'
    }
});

require(['../tests/pubsub', '../tests/handlebars-helpers', '../tests/inclusions',
    '../tests/require-handlebars', '../tests/resthub-backbone-pubsub', '../tests/backbone-remove',
    '../tests/backbone-populate-model', '../tests/backbone-history']);
