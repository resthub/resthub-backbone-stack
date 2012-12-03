require(["backbone", "resthub", "jquery", "underscore", "../tests/validation/model1", "backbone-validation"], function(Backbone, Resthub, $, _, model1) {

    module("resthub-backbone-validation", {
        setup: function() {

            this.Model1 = Backbone.Model.extend({
                className: 'org.resthub.validation.model.User',

                initialize: _.bind(function() {
                    Resthub.Validation.synchronize(this.Model1);
                }, this)
            });

            this.mockedGet = function(url, data) {
                return {
                    success: function(callback) {
                        callback(model1);
                    }
                };
            },

                _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
        },
        teardown: function() {
            Resthub.Validation.forceSynchroForClass("org.resthub.validation.model.User");
        }
    });

    test("Resthub.Validation should be defined", 1, function() {
        ok(Resthub.Validation, "local variable should be defined");
    });

    test("default parameters should be set", 2, function() {
        var locale = window.navigator.language || window.navigator.userLanguage;

        $.get = function(url, data) {
            equal(url, "api/validation/org.resthub.validation.model.User", "incorrect url");
            equal(data.locale, locale, "incorrect locale");

            return {
                success: function(callback) {
                    callback({});
                }
            };
        }

        new this.Model1();
    });

    test("no error on empty response", 1, function() {
        $.get = function(url, data) {
            return {
                success: function(callback) {
                    callback({});
                }
            };
        }

        var model1 = new this.Model1();

        ok(_.isEmpty(model1.validation), "validation should be empty");
    });

    test("model validation populated", 24, function() {
        $.get = this.mockedGet;

        var model1 = new this.Model1();

        ok(!_.isEmpty(model1.validation), "validation should not be empty");
        equal(_.keys(model1.validation).length, 23, "validation should contain 23 keys")

        ok(!_.isEmpty(model1.validation.assertTrue), "validation should contain assertTrue");
        ok(!_.isEmpty(model1.validation.min), "validation should contain min");
        ok(!_.isEmpty(model1.validation.max), "validation should contain max");
        ok(!_.isEmpty(model1.validation.range), "validation should contain range");
        ok(!_.isEmpty(model1.validation.stringSize), "validation should contain stringSize");
        ok(!_.isEmpty(model1.validation.decimalMax), "validation should contain decimalMax");
        ok(!_.isEmpty(model1.validation.decimalMin), "validation should contain decimalMax");
        ok(!_.isEmpty(model1.validation.collSize), "validation should contain collSize");
        ok(!_.isEmpty(model1.validation.url), "validation should contain url");
        ok(!_.isEmpty(model1.validation.urlRegexp), "validation should contain urlRegexp");
        ok(!_.isEmpty(model1.validation.urlComplete), "validation should contain urlComplete");
        ok(!_.isEmpty(model1.validation.pattern), "validation should contain pattern");
        ok(!_.isEmpty(model1.validation.email), "validation should contain email");
        ok(!_.isEmpty(model1.validation.notEmpty), "validation should contain notEmpty");
        ok(!_.isEmpty(model1.validation.assertFalse), "validation should contain assertFalse");
        ok(!_.isEmpty(model1.validation.creditCardNumber), "validation should contain creditCardNumber");
        ok(!_.isEmpty(model1.validation.nullValue), "validation should contain nullValue");
        ok(!_.isEmpty(model1.validation.length), "validation should contain length");
        ok(!_.isEmpty(model1.validation.digits), "validation should contain digits");
        ok(!_.isEmpty(model1.validation.notNull), "validation should contain notNull");
        ok(!_.isEmpty(model1.validation.ignoredProp), "validation should contain ignoredProp");
        ok(!_.isEmpty(model1.validation.notBlank), "validation should contain notBlank");
    });

    test("default url validation", 9, function() {
        $.get = this.mockedGet;

        var model1 = new this.Model1();

        ok(!_.isEmpty(model1.validation.urlDefault), "validation should contain urlDefault");
        ok(_.isArray(model1.validation.urlDefault), "urlDefault property should be an array");
        equal(model1.validation.urlDefault.length, 2, "urlDefault property should contain two constraints");

        ok(model1.set({"urlDefault": undefined}), "urlDefault is not required");
        var validationErrs = model1.validate({"urlDefault": "bad url"});
        ok(validationErrs && validationErrs.urlDefault, "invalid urlDefault is not valid");
        equal(validationErrs.urlDefault, "must be a valid URL", "invalid urlDefault hold the correct error message");
        ok(!model1.validate({"urlDefault": "http://localhost:8080/test?test=test"}), "valid http urlDefault is valid");
        ok(!model1.validate({"urlDefault": "ftp://localhost:8080/test?test=test"}), "valid ftp urlDefault is valid");
        ok(!model1.validate({"urlDefault": "mailto:test@test.fr"}), "valid mailto urlDefault is valid");
    });

    test("url validation", 9, function() {
        $.get = this.mockedGet;

        var model1 = new this.Model1();

        ok(!_.isEmpty(model1.validation.url), "validation should contain urlDefault");
        ok(_.isArray(model1.validation.url), "url property should be an array");
        equal(model1.validation.url.length, 2, "url property should contain two constraints");

        ok(model1.set({"url": undefined}), "url is not required");
        var validationErrs = model1.validate({"url": "bad url"});
        ok(validationErrs && validationErrs.url, "invalid url is not valid");
        validationErrs = model1.validate({"url": "ftp://localhost:8080"});
        ok(validationErrs && validationErrs.url, "invalid ftp url is not valid");
        validationErrs = model1.validate({"url": "http://host:8080"});
        ok(validationErrs && validationErrs.url, "invalid host url is not valid");
        validationErrs = model1.validate({"url": "http://localhost:8181"});
        ok(validationErrs && validationErrs.url, "invalid port url is not valid");
        ok(!model1.validate({"url": "http://localhost:8080/test?test=test"}), "valid http localhost 8080 url is valid");
    });

    test("regexp url validation", 7, function() {
        $.get = this.mockedGet;

        var model1 = new this.Model1();

        ok(!_.isEmpty(model1.validation.urlRegexp), "validation should contain urlRegexp");
        ok(_.isArray(model1.validation.urlRegexp), "urlRegexp property should be an array");
        equal(model1.validation.urlRegexp.length, 2, "urlRegexp property should contain two constraints");

        ok(model1.set({"urlRegexp": undefined}), "urlRegexp is not required");
        var validationErrs = model1.validate({"urlRegexp": "bad url"});
        ok(validationErrs && validationErrs.urlRegexp, "invalid urlRegexp is not valid");
        validationErrs = model1.validate({"urlRegexp": "http://localhost:8080/test"});
        ok(validationErrs && validationErrs.urlRegexp, "invalid urlRegexp pattern is not valid");
        ok(!model1.validate({"urlRegexp": "http://url-test:8080/test?test=test"}), "valid regexp host url is valid");
    });

    test("complete url validation", 9, function() {
        $.get = this.mockedGet;

        var model1 = new this.Model1();

        ok(!_.isEmpty(model1.validation.urlComplete), "validation should contain urlComplete");
        ok(_.isArray(model1.validation.urlComplete), "urlComplete property should be an array");
        equal(model1.validation.urlComplete.length, 2, "urlComplete property should contain two constraints");

        ok(model1.set({"urlComplete": undefined}), "urlComplete is not required");
        var validationErrs = model1.validate({"urlComplete": "bad url"});
        ok(validationErrs && validationErrs.urlComplete, "invalid urlComplete is not valid");
        validationErrs = model1.validate({"urlComplete": "http://resthub:8080/url-test.fr"});
        ok(validationErrs && validationErrs.urlComplete, "invalid http urlComplete is not valid");
        validationErrs = model1.validate({"urlComplete": "ftp://localhost:8080/url-test.fr"});
        ok(validationErrs && validationErrs.urlComplete, "invalid host urlComplete is not valid");
        validationErrs = model1.validate({"urlComplete": "ftp://resthub:8181/url-test.fr"});
        ok(validationErrs && validationErrs.urlComplete, "invalid port urlComplete is not valid");
        ok(!model1.validate({"urlComplete": "ftp://resthub:8080/url-test.fr"}), "valid urlComplete is valid");
    });

});
