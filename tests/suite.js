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
        handlebars:'libs/handlebars',
        'resthub-handlebars':'resthub/handlebars-helpers',
        async:'libs/async',
        'backbone-validation':'libs/backbone-validation',
        'resthub-backbone-validation':'resthub/backbone-validation.ext',
        'backbone-paginator':'libs/backbone.paginator',
        'backbone-queryparams':'libs/backbone.queryparams',
        keymaster:'libs/keymaster',
        hbs:'resthub/handlebars-require'
    }
});

require(['../tests/pubsub', '../tests/handlebars-helpers', '../tests/inclusions',
    '../tests/handlebars-require', '../tests/resthub-backbone-pubsub', '../tests/backbone-remove',
    '../tests/backbone-refresh-model']);
