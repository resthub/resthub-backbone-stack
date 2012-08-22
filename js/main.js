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
        handlebars:"libs/handlebars"
    },
    locale:localStorage.getItem('locale') || 'en-us'
});

// Load our app module and pass it to our definition function
require(['view/app'], function (App) {

    App.initialize();
});