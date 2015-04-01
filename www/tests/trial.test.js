<<<<<<< HEAD
define(['jquery', 'bubbleOverlay', 'url'], function($, bubbleOverlay, url) {
    describe('Test bubbleOverlay', function () {
	it('Test modify bubble overlay function', function() {
	    var worldChart;
	    var data = {'cityDimension':'cityDimension',
			'cityGroup':'cityGroup',
			'cityPoints':'cityPoints',
			'countryDimension':'countryDimension',
			'countryGroup':'countryGroup',
			'countryPoints':'countryPoints',
			'continentDimension':'continentDimension',
			'continentGroup':'continentGroup',
			'continentPoints':'continentPoints'};
	    var bubbles = new bubbleOverlay(worldChart, data);
	    console.log(bubbles.lastState);
	});
    });

    describe('Test url filtering', function () {
	it('Test the filtering of a url', function() {
	    var queryString = 'first=1&second=scnd&third=hello%20world';
	    var filterResult = url.filterURLParams(queryString);

	    expect(filterResult['first']).toEqual('1');
	    expect(filterResult['second']).toEqual('scnd');
	    expect(filterResult['third']).toEqual('hello world');
	});
    });
    
});


       
=======
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
>>>>>>> develop
