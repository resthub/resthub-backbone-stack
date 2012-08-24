require(['handlebars', 'handlebars-helpers'], function(Handlebars) {
    		
	module('handlebars-helpers');

	test('sprintf with 2 params', function() {
		var template = Handlebars.compile('{{sprintf "This is a %s" "test"}}');
                equal( template(), 'This is a test');
	});
        
        test('sprintf with 3 params', function() {
		var template = Handlebars.compile('{{sprintf "This is a %s, and the sky is %s" "test" "blue"}}');
                equal( template(), 'This is a test, and the sky is blue');
	});
        
        test('ifinline without else return value', function() {
		var template = Handlebars.compile('class={{ifinline done "done"}}');
                equal( template({done:true}), 'class=done');
                equal( template({done:false}), 'class=');
	});
        
        test('ifinline with else return value', function() {
		var template = Handlebars.compile('class={{ifinline done "done" "todo"}}');
                equal( template({done:true}), 'class=done');
                equal( template({done:false}), 'class=todo');
	});
        
        test('ifequalsinline without else return value', function() {
		var template = Handlebars.compile('class={{ifequalsinline done "done" "yes"}}');
                equal( template({done:'done'}), 'class=yes');
                equal( template({done:'not'}), 'class=');
                equal( template({done:''}), 'class=');
	});
        
        test('ifequalsinline with else return value', function() {
		var template = Handlebars.compile('class={{ifequalsinline done "done" "yes" "no"}}');
                equal( template({done:'done'}), 'class=yes');
                equal( template({done:'not'}), 'class=no');
                equal( template({done:''}), 'class=no');
	});
		
});