define(['jquery', 'bubbleOverlay'], function($, bubbleOverlay) {
    describe('Load jquery', function () {
	it('should log $', function() {
	    console.log($);
	});
    });

    describe('Load bubbleOverlay', function () {
	it('should log bubbleOverlay', function() {
	    console.log(bubbleOverlay);
	});
    });

});
