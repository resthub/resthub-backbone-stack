require.config({
    baseUrl: '../js',
    shim: {
        'underscore': {
            exports: '_'
        },
        'underscore-string': {
            deps: [
            'underscore'
            ]
        },
        'handlebars-orig': {
            exports: 'Handlebars'
        },
        'backbone-orig': {
            deps: [
            'underscore',
            'underscore-string',
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
        },
        'bootstrap': {
            deps: [
            'jquery'
            ]
        },
        'backbone-relational': {
            deps: [
            'backbone-orig',  
            'underscore'  
            ]
        },
        'moment-fr': {
            deps: [
                'moment'
            ]
        },
        'keymaster': {
            exports: 'key'
        },
        'async': {
            exports: 'async'
        }
    },

    // Libraries
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        'underscore-string': 'lib/underscore-string',
        'backbone-orig': 'lib/backbone',
        backbone: 'lib/resthub/backbone-resthub',
        localstorage: 'lib/localstorage',
        text: 'lib/text',
        i18n: 'lib/i18n',
        pubsub: 'lib/resthub/pubsub',
        'bootstrap': 'lib/bootstrap',
        'backbone-validation-orig': 'lib/backbone-validation',
        'backbone-validation': 'lib/resthub/backbone-validation-ext',
        'handlebars-orig': 'lib/handlebars',
        'handlebars': 'lib/resthub/handlebars-helpers',
        'backbone-queryparams': 'lib/backbone-queryparams',
        'backbone-paginator': 'lib/backbone-paginator',
        'backbone-relational': 'lib/backbone-relational',
        async: 'lib/async',
        keymaster: 'lib/keymaster',
        hbs: 'lib/resthub/require-handlebars',
        'moment': 'lib/moment',
        'moment-fr': 'lib/moment-lang/fr'
    }
});

require(['../tests/pubsub', '../tests/handlebars-helpers', '../tests/inclusions',
    '../tests/require-handlebars', '../tests/backbone-pubsub', '../tests/backbone-remove',
    '../tests/backbone-populate-model', '../tests/backbone-history']);
