// Set the require.js configuration for your application.
require.config({

  // Libraries
  paths: {
    jquery: "libs/jquery",
    underscore: "libs/underscore",
    'underscore.string': "libs/underscore.string",
    backbone: "libs/backbone",
    localstorage: "libs/localstorage",
    use: "libs/use",
    text: "libs/text",
    i18n: "libs/i18n"
  },
  locale: localStorage.getItem('locale') || 'en-us'
});

// Load our app module and pass it to our definition function
require(['underscore', 'underscore.string', 'view/app'], function(_, _s, App){
    
  // Merge Underscore and Underscore.String
  _.str = _s;
  _.mixin(_.str.exports());
  _.str.include('Underscore.string', 'string');
  
  App.initialize();
});