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
        }
    },

    // Libraries
    paths:{
        jquery:"../js/libs/jquery",
        underscore:"../js/libs/underscore",
        'underscore.string':"../js/libs/underscore.string",
        backbone:"../js/libs/backbone",
        localstorage:"../js/libs/localstorage",
        text:"../js/libs/text",
        i18n:"../js/libs/i18n",
        pubsub:"../js/resthub/pubsub",
        handlebars:"../js/libs/handlebars",
        'handlebars-helpers':"../js/resthub/handlebars-helpers"
    }
});

require({baseUrl: "../"}, ['tests/pubsub',
                           'tests/handlebars-helpers']);
