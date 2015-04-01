var tests = [];

var TEST_REGEXP = /test\.js$/i;

for (var file in window.__karma__.files) {
    if (TEST_REGEXP.test(file) && tests.indexOf(file) == -1) {
	tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',


    // If you begin the path with '/' then it will be an absolute path - ignoring the baseUrl
    paths: {
        'crossfilter': 'bower_components/crossfilter/crossfilter',
        'd3': 'bower_components/d3/d3',
        'colorbrewer': 'bower_components/colorbrewer/colorbrewer',
        'dc': 'lib/dc',
        'topojson': 'lib/topojson',
        'bubbleOverlay': 'app/modules/bubbles/bubbleOverlay',
        'bubbleOverlayHelpers': 'app/modules/bubbles/helpers',
	'url': 'app/modules/url',
        'print': 'lib/print',
        'jquery' : 'lib/jquery',
        'underscore': 'lib/underscore',
    },
    
    shim: {
    	'crossfilter': {
      	    deps: [],
      	    exports: 'crossfilter'
	},
    	'd3': {
    	    deps: [],
    	    exports: 'd3'
	},
    	'colorbrewer': {
    	    deps: [],
    	    exports: 'colorbrewer'
	},
    	'dc': {
    	    deps: [],
    	    exports: 'dc'
	},
    	'topojson': {
    	    deps: [],
    	    exports: 'topojson'
	},
    	'bubbleOverlay': {
    	    deps: [],
    	    exports: 'bubbleOverlay'
	},
	'url': {
	    deps: [],
	    exports: 'url'
	},
    	'print': {
    	    deps: [],
    	    exports: 'print'
	},
        'jquery': {
            deps: [],
            exports: '$'
	},
	'underscore': {
	    exports: '_'
        }
    },
    
    
    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});

