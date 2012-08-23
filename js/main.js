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
        jquery:"libs/jquery",
        underscore:"libs/underscore",
        'underscore.string':"libs/underscore.string",
        backbone:"libs/backbone",
        localstorage:"libs/localstorage",
        text:"libs/text",
        i18n:"libs/i18n",
        pubsub:"resthub/pubsub",
        handlebars:"libs/handlebars",
        'handlebars-helpers':"resthub/handlebars-helpers"
        'bootstrap':'libs/bootstrap'
    }
});

// Preload main libs
require(['app', 'backbone', 'handlebars', 'handlebars-helpers'], function (App) {

    App.initialize();
});