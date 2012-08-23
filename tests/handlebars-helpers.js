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
		
});