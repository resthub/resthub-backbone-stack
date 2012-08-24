// Set the require.js configuration for your application.
require.config({
    baseUrl:'../js',
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
        }
    },

    // Libraries
    paths:{
        jquery:'libs/jquery',
        underscore:'libs/underscore',
        'underscore.string':'libs/underscore.string',
        backbone:'libs/backbone',
        localstorage:'libs/localstorage',
        text:'libs/text',
        i18n:'libs/i18n',
        pubsub:'resthub/pubsub',
        handlebars:'libs/handlebars',
        'resthub-handlebars':'resthub/handlebars-helpers'
    }
});

require(['../tests/pubsub', '../tests/handlebars-helpers']);
