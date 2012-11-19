require(["jquery", "backbone", "resthub"], function($, Backbone, Resthub) {

    module("backbone-populate-model", {
        setup: function() {

            var Person = Backbone.Model.extend({initialize: function() {
            }});

            this.TestView = Resthub.View.extend({
                initialize: function() {
                    this.render();
                },

                render: function() {
                    this.$el.html("<form id='myForm'><input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/></form>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });

            this.TestView2 = Resthub.View.extend({
                initialize: function() {
                    this.model = new Person();
                    this.model2 = new Person();
                    this.render();
                },

                render: function() {
                    this.$el.html("<form id='myForm'><input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/></form>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });

            this.TestView3 = Resthub.View.extend({

                tagName: 'form',

                attributes: {
                    id: 'myForm'
                },

                initialize: function() {
                    this.model = new Person();
                    this.render();
                },

                render: function() {
                    this.$el.html("<input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });

            this.TestView4 = Resthub.View.extend({
                initialize: function() {
                    this.model = new Person();
                    this.render();
                },

                render: function() {
                    this.$el.html("<form id='myForm'><input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/><textarea name='description'>description</textarea></form>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });

            this.TestView5 = Resthub.View.extend({
                initialize: function() {
                    this.model = new Person();
                    this.model2 = new Person();
                    this.render();
                },

                render: function() {
                    this.$el.html("<form id='myForm'><input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/><input type='button' name='input' value='Input'/></form>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });

            this.TestView6 = Resthub.View.extend({
                initialize: function() {
                    this.model = new Person();
                    this.render();
                },

                render: function() {
                    this.$el.html("<form id='myForm'><input type='text' name='name' value='myName'/><input type='email' name='email' value='email@email.fr'/><textarea name='description'>description</textarea><select name='list'><option selected='selected' value='7'>value</option></select></form>");
                    $("#qunit-fixture #main").html(this.el);
                }
            });
        },
        teardown: function() {
        }
    });

    test("View should be rendered", 1, function() {
        new this.TestView();

        ok($("#qunit-fixture > #main > div").find("myForm"), "HTML content should be rendered");
    });

    test("no error if no model", 1, function() {
        var testView = new this.TestView();
        testView.populateModel();

        ok(true, "no error");
    });

    test("model should be set with default values", 3, function() {
        var testView = new this.TestView2();
        testView.populateModel();

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
    });

    test("model should be set with explicit jquery form element", 3, function() {
        var testView = new this.TestView2();
        testView.populateModel($("#myForm"));

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
    });

    test("model should be set with explicit jquery selector", 3, function() {
        var testView = new this.TestView2();
        testView.populateModel("#myForm");

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
    });

    test("no error with inexistent form", 6, function() {
        var testView = new this.TestView2();
        testView.populateModel("#noForm");

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");

        testView.populateModel($("#noForm"));

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");
    });

    test("model should be set with explicit model", 6, function() {
        var testView = new this.TestView2();
        testView.populateModel(null, testView.model2);

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");

        ok(testView.model2, "model2 defined");
        equal(testView.model2.get('name'), "myName", "model name set");
        equal(testView.model2.get('email'), "email@email.fr", "model email set");
    });

    test("model should be set with explicit model and form", 6, function() {
        var testView = new this.TestView2();
        testView.populateModel($("#myForm"), testView.model2);

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), undefined, "model name undefined");
        equal(testView.model.get('email'), undefined, "model email undefined");

        ok(testView.model2, "model2 defined");
        equal(testView.model2.get('name'), "myName", "model name set");
        equal(testView.model2.get('email'), "email@email.fr", "model email set");
    });

    test("el as form should be detected", 3, function() {
        var testView = new this.TestView3();
        testView.populateModel();

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
    });

    test("textarea should not be ignored", 4, function() {
        var testView = new this.TestView4();
        testView.populateModel();

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
        equal(testView.model.get('description'), "description", "model description set");
    });

    test("input type button should be ignored", 4, function() {
        var testView = new this.TestView5();
        testView.populateModel();

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
        equal(testView.model.get('input'), undefined, "input ignored");
    });

    test("select should not be ignored", 5, function() {
        var testView = new this.TestView6();
        testView.populateModel();

        ok(testView.model, "model defined");
        equal(testView.model.get('name'), "myName", "model name set");
        equal(testView.model.get('email'), "email@email.fr", "model email set");
        equal(testView.model.get('description'), "description", "model description set");
        equal(testView.model.get('list'), "7", "model list set");
    });
});
