require(['resthub-handlebars'], function (Handlebars) {

    module('handlebars-helpers');

    test('sprintf with 2 params', function () {
        var template = Handlebars.compile('{{sprintf "This is a %s" "test"}}');
        equal(template(), 'This is a test');
    });

    test('sprintf with 3 params', function () {
        var template = Handlebars.compile('{{sprintf "This is a %s, and the sky is %s" "test" "blue"}}');
        equal(template(), 'This is a test, and the sky is blue');
    });
     
    test('ifinline with else return value', function() {
            var template = Handlebars.compile('class={{ifinline done "done" "todo"}}');
            equal( template({done:true}), 'class=done');
            equal( template({done:false}), 'class=todo');
    });

    test('ifequalsinline with else return value', function() {
            var template = Handlebars.compile('class={{ifequalsinline done "done" "yes" "no"}}');
            equal( template({done:'done'}), 'class=yes');
            equal( template({done:'not'}), 'class=no');
            equal( template({done:''}), 'class=no');
    });
		
    test('ifinline', function () {
        expect(5);
        var template = Handlebars.compile('{{ifinline done "done"}}');
        equal(template({done:true}), 'done');
        equal(template({done:false}), '');
        equal(template({}), '');
        equal(template({done:null}), '');
        equal(template({done:[]}), '');
    });

    test('unlessinline', function () {
        expect(5);
        var template = Handlebars.compile('{{unlessinline done "todo"}}');
        equal(template({done:true}), '');
        equal(template({done:false}), 'todo');
        equal(template({}), 'todo');
        equal(template({done:null}), 'todo');
        equal(template({done:[]}), 'todo');
    });

    test('ifequalsinline', function () {
        expect(5);
        var template = Handlebars.compile('{{ifequalsinline id 1 "active"}}');
        equal(template({id:1}), 'active');
        equal(template({id:0}), '');
        equal(template({id:"1"}), '');
        equal(template({}), '');
        equal(template({id:null}), '');
    });

    test('unlessequalsinline', function () {
        expect(5);
        var template = Handlebars.compile('{{unlessequalsinline id 1 "disabled"}}');
        equal(template({id:1}), '');
        equal(template({id:0}), 'disabled');
        equal(template({id:"1"}), 'disabled');
        equal(template({}), 'disabled');
        equal(template({id:null}), 'disabled');
    });

    test('ifequals', function () {
        expect(5);
        var template = Handlebars.compile('{{#ifequals id 1}}<span>1</span>{{/ifequals}}');
        equal(template({id:1}), '<span>1</span>');
        equal(template({id:0}), '');
        equal(template({id:"1"}), '');
        equal(template({}), '');
        equal(template({id:null}), '');
    });

    test('unlessequals', function () {
        expect(5);
        var template = Handlebars.compile('{{#unlessequals id 1}}<span>0</span>{{/unlessequals}}');
        equal(template({id:1}), '');
        equal(template({id:0}), '<span>0</span>');
        equal(template({id:"1"}), '<span>0</span>');
        equal(template({}), '<span>0</span>');
        equal(template({id:null}), '<span>0</span>');
    });

    test('for', function () {
        expect(14);
        var template = Handlebars.compile('{{#for 0 5}}{{this}}{{/for}}');
        equal(template(), '012345');

        template = Handlebars.compile('{{#for start end}}{{this}}{{/for}}');
        equal(template({}), '');
        equal(template({start:0, end:5}), '012345');
        equal(template({start:"0", end:"5"}), '012345');
        equal(template({start:1, end:1}), '1');
        equal(template({start:"1", end:"1"}), '1');
        equal(template({start:null, end:5}), '');
        equal(template({start:0, end:null}), '');
        equal(template({start:null, end:null}), '');
        equal(template({end:5}), '');
        equal(template({start:0}), '');
        equal(template({start:5, end:0}), '');
        equal(template({start:-1, end:5}), '');
        equal(template({start:0, end:-1}), '');
    });

});