define(['lib/jquery'], function($) {
    describe('failing test', function() {
        it('should fail', function() {
            expect('Hello World!').toEqual('require.js up and running');
        });
    });

    describe('Load jquery', function () {
	it('should log $', function() {
	    console.log($);
	});
    });
});
