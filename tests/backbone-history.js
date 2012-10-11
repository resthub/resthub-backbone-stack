require(["jquery", "backbone"], function($, Backbone) {

    module("backbone-history", {
        setup: function() {

            var TestView = Backbone.ResthubView.extend({

                initialize: function() {
                    this.text = '<a id="aTest" href="/route1">route1</a><a id="aTest2" href="/route2">route2</a>';
                    this.render();
                },

                render: function() {
                    this.$el.html(this.text);
                    $("#qunit-fixture #main").html(this.el);
                }
            });

            var TestRouter = Backbone.Router.extend({
               
        
            routes: {
                'route1': 'route1',
                'route2': 'route2'
            },
           
            route1: function() {
                console.debug("titi");
                ok(true);
                start();
            },

            route2: function() {
                console.debug("tutu");
                ok(true, "Passed and ready to resume!" );
                start();
            }

           
            });

            var testView = new TestView();
        var testRouter = new TestRouter();
        Backbone.history.stop();
        Backbone.history.start({pushState: true, root: "/tests"});
        


        }

    });
   
    asyncTest("Route1", 1, function() {
        QUnit.triggerEvent($("#aTest").get(0), "click");
    });

    asyncTest("Route2", 1, function() {
        QUnit.triggerEvent($("#aTest2").get(0), "click");
    });

    
});
