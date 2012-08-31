require(["jquery", "backbone"], function($, Backbone) {

    module("backbone-remove", {
        setup: function() {
            this.TestView = Backbone.View.extend({
                initialize: function() {
                    this.text = 'HTML Content';
                    this.render();
                },

                render: function() {
                    this.$el.html(this.text);
                    $("#qunit-fixture #main").html(this.el);
                }
            });
            this.TestView2 = Backbone.View.extend({
                initialize: function() {
                    this.counts = {};
                    this.text = 'HTML Content 2';
                    this.render();
                },

                render: function() {
                    this.$el.html(this.text);
                    $("#qunit-fixture #main").html(this.el);
                },

                dispose: function() {
                    this.counts.dispose = (this.counts.dispose || 0) + 1;
                }
            });
        },
        teardown: function() {
        }
    });

    test("View should be rendered", 1, function() {
        var testView = new this.TestView();

        equal($("#qunit-fixture > #main > div").html(), testView.text, "HTML content should be rendered");
    });

    test("remove should delete html", 1, function() {
        var testView = new this.TestView();
        testView.remove();

        equal($("#qunit-fixture #main").html(), "", "no HTML content should be rendered");
    });

    test("remove should call dispose", 3, function() {
        var testView = new this.TestView2();

        testView.remove();
        equal(testView.counts.dispose, 1, "dispose called only once");

        testView.$el.remove();
        equal(testView.counts.dispose, 2, "dispose called once again");

        testView = new this.TestView2();

        testView.$el.remove();
        equal(testView.counts.dispose, 1, "dispose called once again");
    });

    test("remove on parent should call dispose", 1, function() {
        var testView = new this.TestView2();

        testView.$el.parent().remove();
        equal(testView.counts.dispose, 1, "dispose called");
    });

    test("html should not call dispose", 1, function() {
        var testView = new this.TestView2();

        testView.$el.html("test");
        equal(testView.counts.dispose, undefined, "dispose not called");
    });

    test("html on parents should call dispose", 2, function() {
        var testView = new this.TestView2();

        testView.$el.parent().html("test");
        equal(testView.counts.dispose, 1, "dispose called");

        testView = new this.TestView2();

        testView.$el.parent().parent().html("test");
        equal(testView.counts.dispose, 1, "dispose called");
    });

    test("empty should not call dispose", 1, function() {
        var testView = new this.TestView2();

        testView.$el.empty();
        equal(testView.counts.dispose, undefined, "dispose not called");
    });

    test("empty on parents should call dispose", 2, function() {
        var testView = new this.TestView2();

        testView.$el.parent().empty();
        equal(testView.counts.dispose, 1, "dispose called");

        testView = new this.TestView2();

        testView.$el.parent().parent().empty();
        equal(testView.counts.dispose, 1, "dispose called");
    });

});
