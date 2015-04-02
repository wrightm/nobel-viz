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


    describe('Test url query param generation', function() {
	it('Verifies the correct query is returned', function() {
	    var obj = {'first': '1', 'second':'scnd', 'third':['hello','world']};
	    expect(url.generateURLQuery(obj)).toEqual('first=1&second=scnd&third=hello,world');

	    obj = {'only':['one','two','three']};
	    expect(url.generateURLQuery(obj)).toEqual('only=one,two,three');
	});
    });
});
