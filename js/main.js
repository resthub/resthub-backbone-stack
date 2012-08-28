// Set the require.js configuration for your application.
require.config({

    shim:{
        'underscore':{
            exports:'_'
        },
        'underscore.string':{
            deps:[
                'underscore'
            ]
        },
        'handlebars':{
            exports:'Handlebars'
        },
        'backbone':{
            deps:[
                'underscore',
                'underscore.string',
                'jquery'
            ],
            exports:'Backbone'
        },
        'backbone-queryparams':{
            deps:[
                'backbone',
                'underscore'
            ]
        },
        'backbone-paginator':{
            deps:[
                'backbone',
                'underscore',
                'jquery'
            ],
            exports:'Backbone.Paginator'
        },
        async:{
            deps:[
                'underscore'
            ]
        }
    },

    // Libraries
    paths:{
        jquery:'libs/jquery',
        underscore:'libs/underscore',
        'underscore.string':'libs/underscore.string',
        backbone:'libs/backbone',
        'resthub-backbone':'resthub/backbone.ext',
        localstorage:'libs/localstorage',
        text:'libs/text',
        i18n:'libs/i18n',
        pubsub:'resthub/pubsub',
        'bootstrap':'libs/bootstrap',
        'backbone-validation':'libs/backbone-validation',
        'resthub-backbone-validation':'resthub/backbone-validation.ext',
        handlebars:'libs/handlebars',
        'resthub-handlebars':'resthub/handlebars-helpers',
        'backbone-queryparams':'libs/backbone.queryparams',
        'backbone-paginator':'libs/backbone.paginator',
        async:'libs/async.js',
        keymaster:'libs/keymaster',
        hbs: 'resthub/handlebars-require'
    }
});

// Preload main libs
require(['router'], function (Router) {

    Router.initialize();
});