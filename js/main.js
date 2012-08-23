// Set the require.js configuration for your application.
require.config({

    shim:{
        'underscore':{
            exports:'_'
        },
        'underscore.string':{
            deps:[
                'underscore'
            ],
            exports:'_s'
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
        jquery:"libs/jquery",
        underscore:"libs/underscore",
        'underscore.string':"libs/underscore.string",
        backbone:"libs/backbone",
        localstorage:"libs/localstorage",
        use:"libs/use",
        text:"libs/text",
        i18n:"libs/i18n",
        pubsub:"libs/resthub/pubsub",
        handlebars:"libs/handlebars",
        'handlebars-helpers':"libs/resthub/handlebars-helpers",
        'bootstrap':'libs/bootstrap'
    }
});

// Preload main libs
require(['app', 'backbone', 'handlebars', 'handlebars-helpers'], function (App) {

    App.initialize();
});