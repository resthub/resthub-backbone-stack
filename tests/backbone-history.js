require(['jquery', 'backbone', 'resthub'], function($, Backbone, Resthub) {

    module("backbone-history", {
        setup: function() {

            var TestView = Resthub.View.extend({

                initialize: function() {
                    this.text = '<a id="aTest" href="/route1">route1</a><a id="aTest2" href="/route2">route2</a><a id="aTest3" href="/">route3</a>';
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
                'route2': 'route2',
                'route3': 'route3'
            },
           
            route1: function() {
                ok(true);
                start();
            },

            route2: function() {
                ok(true);
                start();
            },
            
            route3: function() {

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

    asyncTest("Route2", 2, function() {
        QUnit.triggerEvent($("#aTest2").get(0), "click");
        QUnit.triggerEvent($("#aTest3").get(0), "click");
    });
        
});
