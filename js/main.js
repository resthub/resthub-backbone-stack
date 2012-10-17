// Set the require.js configuration for your application.
require.config({

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
        'keymaster': {
            exports: 'key'
        },
        'async': {
            exports: 'async'
        }
    },

    // Libraries
    paths: {
        jquery: 'libs/jquery',
        underscore: 'libs/underscore',
        'underscore-string': 'libs/underscore-string',
        'backbone-orig': 'libs/backbone',
        backbone: 'libs/resthub/backbone-resthub',
        localstorage: 'libs/localstorage',
        text: 'libs/text',
        i18n: 'libs/i18n',
        pubsub: 'libs/resthub/pubsub',
        'bootstrap': 'libs/bootstrap',
        'backbone-validation-orig': 'libs/backbone-validation',
        'backbone-validation': 'libs/resthub/backbone-validation-ext',
        'handlebars-orig': 'libs/handlebars',
        'handlebars': 'libs/resthub/handlebars-helpers',
        'backbone-queryparams': 'libs/backbone-queryparams',
        'backbone-paginator': 'libs/backbone-paginator',
        'backbone-relational': 'libs/backbone-relational',
        async: 'libs/async',
        keymaster: 'libs/keymaster',
        hbs: 'libs/resthub/require-handlebars',
        'moment': 'libs/moment'
    }
});

require(['router'], function(Router) {

    new Router();

});