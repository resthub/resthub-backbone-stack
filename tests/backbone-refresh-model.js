require(["jquery", "backbone"], function ($, Backbone) {

    module("backbone-refresh-model", {
        setup:function () {

            var Person = Backbone.Model.extend({initialize:function () {
            }});

            this.TestView = Backbone.View.extend({
                initialize:function () {
                    this.render();
                },

                render:function () {
                    this.$el.html("<form id='myForm'><input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/></form>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });

            this.TestView2 = Backbone.View.extend({
                initialize:function () {
                    this.model = new Person();
                    this.model2 = new Person();
                    this.render();
                },

                render:function () {
                    this.$el.html("<form id='myForm'><input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/></form>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });
        },
        teardown:function () {
        }
    });

    test("View should be rendered", 1, function () {
        new this.TestView();

        ok($("#qunit-fixture > #main > div").find("myForm"), "HTML content should be rendered");
    });

    test("no error if no model", 1, function () {
        var testView = new this.TestView();
        testView.refreshModel();

        ok(true, "no error");
    });

    test("model should be set with default values", 3, function () {
        var testView = new this.TestView2();
        testView.refreshModel();

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
    });

    test("model should be set with explicit jquery form element", 3, function () {
        var testView = new this.TestView2();
        testView.refreshModel($("#myForm"));

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
    });

    test("model should be set with explicit jquery selector", 3, function () {
        var testView = new this.TestView2();
        testView.refreshModel("#myForm");

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
    });

    test("no error with insistent form", 6, function () {
        var testView = new this.TestView2();
        testView.refreshModel("#noForm");

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");

        testView.refreshModel($("#noForm"));

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");
    });

    test("model should be set with explicit model", 6, function () {
        var testView = new this.TestView2();
        testView.refreshModel(null, testView.model2);

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");

        ok(testView.model2, "model2 defined");
        equal(testView.model2.get('name'), "myName", "model name set");
        equal(testView.model2.get('email'), "email@email.fr", "model email set");
    });

    test("model should be set with explicit model and form", 6, function () {
        var testView = new this.TestView2();
        testView.refreshModel($("#myForm"), testView.model2);

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");

        ok(testView.model2, "model2 defined");
        equal(testView.model2.get('name'), "myName", "model name set");
        equal(testView.model2.get('email'), "email@email.fr", "model email set");
    });

});
